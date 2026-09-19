import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AcademyStatus, InquiryStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomUUID } from 'crypto';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { BillingService } from '../billing/billing.service';
import { PlatformEmailService } from '../billing/platform-email.service';
import { PlatformPaystackService } from '../billing/platform-paystack.service';
import { PrismaService } from '../prisma/prisma.service';
import { ROLE_NAMES } from '../rbac/permissions.constants';
import { StorageService } from '../storage/storage.service';
import { InitializeSignupPaymentDto } from './dto/initialize-signup-payment.dto';
import { OnboardAcademyDto } from './dto/onboard-academy.dto';
import { SignupAcademyDto } from './dto/signup-academy.dto';
import { SubmitPlatformLeadDto } from './dto/submit-platform-lead.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { VerifySignupPaymentDto } from './dto/verify-signup-payment.dto';
import { PlatformAdminJwtPayload } from './platform-admin.types';

function generateTemporaryPassword(): string {
  return randomBytes(9).toString('base64url');
}

// The lead form is public and unauthenticated, so its fields must never be
// interpolated into the notification email's HTML unescaped — otherwise
// anyone could inject markup/links into a message SAMS staff open and trust.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

@Injectable()
export class PlatformAdminService {
  private readonly jwt: JwtService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
    private readonly billing: BillingService,
    private readonly storage: StorageService,
    private readonly platformPaystack: PlatformPaystackService,
    private readonly platformEmail: PlatformEmailService,
    private readonly config: ConfigService,
  ) {
    this.jwt = new JwtService({
      secret: config.get<string>('JWT_PLATFORM_ADMIN_SECRET'),
      signOptions: { expiresIn: config.get<string>('JWT_PLATFORM_ADMIN_TTL') },
    });
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const admin = await this.prisma.platformAdmin.findUnique({ where: { email } });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: PlatformAdminJwtPayload = { sub: admin.id, email: admin.email };
    return { accessToken: await this.jwt.signAsync(payload) };
  }

  // The public self-serve flow no longer lets the caller pick their own slug
  // (see sams-signup-page.tsx) — it's derived from the academy name, so two
  // "Riverside FC" signups would otherwise collide. Appending "-2", "-3", …
  // resolves that silently instead of failing a signup that, in the paid
  // flow, happens *after* the signup fee has already been charged.
  private async resolveUniqueSlug(baseSlug: string): Promise<string> {
    let candidate = baseSlug;
    for (let suffix = 2; await this.prisma.academy.findUnique({ where: { slug: candidate } }); suffix += 1) {
      candidate = `${baseSlug}-${suffix}`;
    }
    return candidate;
  }

  // Shared by both ways an academy comes into being: a platform admin
  // onboarding one on someone's behalf (onboardAcademy) and a prospective
  // academy signing itself up from the public landing page (signupAcademy) —
  // same academy/settings/role/user/subscription creation either way, they
  // only differ in whose password ends up on the account and whether it must
  // be rotated on first login.
  private async createAcademyWithAdmin(params: {
    slug: string;
    name: string;
    brandName?: string;
    logo?: Express.Multer.File;
    adminEmail: string;
    adminFirstName: string;
    adminLastName: string;
    passwordHash: string;
    mustChangePassword: boolean;
    // Platform-admin onboarding picks its slug deliberately, so a collision
    // there is a genuine mistake worth surfacing (ConflictException). Public
    // self-serve signup should just resolve it — see resolveUniqueSlug above.
    resolveSlugConflict?: boolean;
  }) {
    const slug = params.resolveSlugConflict
      ? await this.resolveUniqueSlug(params.slug)
      : params.slug;

    if (!params.resolveSlugConflict) {
      const existing = await this.prisma.academy.findUnique({ where: { slug } });
      if (existing) {
        throw new ConflictException(`An academy with slug '${slug}' already exists`);
      }
    }

    const academy = await this.prisma.academy.create({
      data: { slug, name: params.name, status: 'ACTIVE' },
    });

    const adminUser = await this.tenantContext.run({ academyId: academy.id, slug: academy.slug }, async () => {
      // The logo is uploaded here, inside this tenantContext.run() scope, not
      // before it: StorageService namespaces every file under the academy's
      // slug (see its own fail-closed tenant-context requirement), and that
      // slug only resolves once we're inside this block.
      let logoUrl: string | undefined;
      if (params.logo) {
        const stored = await this.storage.save(params.logo.originalname, params.logo.mimetype, params.logo.buffer);
        logoUrl = this.storage.resolvePath(stored.storageKey);
      }

      await this.prisma.academySettings.create({
        data: { academyId: academy.id, brandName: params.brandName ?? params.name, logoUrl },
      });
      // Every academy launches with the same "every Saturday" fixture as a starting
      // point — Head Coach/Admin can add more slots or change this one afterward
      // (see TrainingService#listSchedule/addScheduleSlot).
      await this.prisma.trainingScheduleSlot.create({
        data: { academyId: academy.id, dayOfWeek: 6, startTime: '08:00', endTime: '10:00' },
      });

      const adminRole = await this.prisma.role.findUniqueOrThrow({ where: { name: ROLE_NAMES.ADMIN } });
      const user = await this.prisma.user.create({
        data: {
          email: params.adminEmail,
          passwordHash: params.passwordHash,
          firstName: params.adminFirstName,
          lastName: params.adminLastName,
          mustChangePassword: params.mustChangePassword,
        },
      });
      await this.prisma.userRole.create({ data: { userId: user.id, roleId: adminRole.id } });
      return user;
    });

    await this.billing.createInitialSubscription(academy.id);

    return { academy, adminUser };
  }

  // Reuses the same shared, already-seeded Role catalog every academy draws
  // from (see Phase 6: Role/Permission are global, not re-seeded per tenant).
  // The admin's password is a one-time random value returned only in this
  // response, never stored anywhere else, with mustChangePassword forced so
  // it's immediately rotated.
  async onboardAcademy(dto: OnboardAcademyDto) {
    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    const { academy, adminUser } = await this.createAcademyWithAdmin({
      slug: dto.slug,
      name: dto.name,
      brandName: dto.brandName,
      adminEmail: dto.adminEmail,
      adminFirstName: dto.adminFirstName,
      adminLastName: dto.adminLastName,
      passwordHash,
      mustChangePassword: true,
    });

    return {
      academy,
      admin: { email: adminUser.email, temporaryPassword },
    };
  }

  // Public self-serve path from the SAMS landing page's "Sign up" flow — the
  // admin chose this password themselves just now, so unlike onboardAcademy
  // there's nothing to rotate.
  async signupAcademy(dto: SignupAcademyDto, logo?: Express.Multer.File) {
    if (logo && !logo.mimetype.startsWith('image/')) {
      throw new BadRequestException('Logo must be an image file');
    }

    const passwordHash = await bcrypt.hash(dto.adminPassword, 10);

    const { academy } = await this.createAcademyWithAdmin({
      slug: dto.slug,
      name: dto.name,
      brandName: dto.brandName,
      logo,
      adminEmail: dto.adminEmail,
      adminFirstName: dto.adminFirstName,
      adminLastName: dto.adminLastName,
      passwordHash,
      mustChangePassword: false,
      resolveSlugConflict: true,
    });

    return { academy: { id: academy.id, slug: academy.slug, name: academy.name } };
  }

  async setAcademyStatus(id: string, status: AcademyStatus) {
    const academy = await this.prisma.academy.findUnique({ where: { id } });
    if (!academy) {
      throw new NotFoundException('Academy not found');
    }
    return this.prisma.academy.update({ where: { id }, data: { status } });
  }

  // Loops per-academy (same pattern as the Phase 8 cron jobs) since active
  // player count is tenant-scoped data — Academy itself isn't, so listing the
  // academies to loop over needs no special scoping.
  //
  // Deliberately does NOT surface anything from that academy's own Invoice/
  // Payment models (what its parents pay it) — that's the academy's own
  // private business data, unrelated to its relationship with SAMS, and an
  // earlier version of this method conflated the two by summing it here as
  // "totalPaidInvoiceAmount". What a platform admin actually needs is how
  // much *this academy* has paid *SAMS* — that's PlatformInvoice, summed below.
  async listAcademiesWithHealth() {
    const academies = await this.prisma.academy.findMany({ orderBy: { createdAt: 'asc' } });

    const results = [];
    for (const academy of academies) {
      const { activePlayerCount, lastLoginAt } = await this.tenantContext.run(
        { academyId: academy.id, slug: academy.slug },
        async () => {
          const [playerCount, lastLogin] = await Promise.all([
            this.prisma.player.count({ where: { status: 'ACTIVE' } }),
            this.prisma.user.aggregate({ _max: { lastLoginAt: true } }),
          ]);
          return { activePlayerCount: playerCount, lastLoginAt: lastLogin._max.lastLoginAt };
        },
      );

      // Neither AcademySubscription nor PlatformInvoice is tenant-scoped (see
      // their schema notes), so these are plain, unscoped-by-RLS lookups
      // filtered explicitly by academyId — fine here since the caller is the
      // platform admin, who is meant to see every academy's billing state at once.
      const [subscription, paidToSams] = await Promise.all([
        this.prisma.academySubscription.findUnique({ where: { academyId: academy.id } }),
        this.prisma.platformInvoice.aggregate({
          where: { academyId: academy.id, status: 'PAID' },
          _sum: { amount: true },
        }),
      ]);

      results.push({
        ...academy,
        activePlayerCount,
        lastLoginAt,
        subscriptionStatus: subscription?.status ?? null,
        subscriptionPeriodEnd: subscription?.currentPeriodEnd ?? null,
        subscriptionPaidToDate: Number(paidToSams._sum.amount ?? 0),
      });
    }
    return results;
  }

  async getPricing() {
    const pricing = await this.prisma.platformPricing.findUnique({ where: { id: 'default' } });
    return {
      pricePerPlayer: Number(pricing?.pricePerPlayer ?? 20),
      signupFee: Number(pricing?.signupFee ?? 0),
      currency: pricing?.currency ?? 'GHS',
    };
  }

  async updatePricing(dto: UpdatePricingDto) {
    const pricing = await this.prisma.platformPricing.upsert({
      where: { id: 'default' },
      update: { pricePerPlayer: dto.pricePerPlayer, signupFee: dto.signupFee },
      create: { id: 'default', pricePerPlayer: dto.pricePerPlayer, signupFee: dto.signupFee },
    });
    return {
      pricePerPlayer: Number(pricing.pricePerPlayer),
      signupFee: Number(pricing.signupFee),
      currency: pricing.currency,
    };
  }

  // Step one of paid self-serve signup: charge the platform's configured
  // one-time signup fee *before* anything is created. The academy/admin
  // details the caller already collected aren't persisted anywhere here —
  // the frontend carries them through the Paystack redirect itself and
  // re-submits them to verifySignupPayment below.
  async initializeSignupPayment(dto: InitializeSignupPaymentDto) {
    const pricing = await this.prisma.platformPricing.findUnique({ where: { id: 'default' } });
    const signupFee = Number(pricing?.signupFee ?? 0);
    if (signupFee <= 0) {
      throw new BadRequestException(
        'Self-serve signup is not available yet — ask a platform admin to configure the signup fee.',
      );
    }

    const reference = `signup_${randomUUID()}`;
    const result = await this.platformPaystack.initializeTransaction({
      email: dto.email,
      amount: signupFee,
      reference,
      callbackUrl: dto.callbackUrl,
    });
    return { authorizationUrl: result.authorizationUrl, reference: result.reference };
  }

  // Step two: verify the signup fee was actually paid (never trusts the
  // redirect alone — see billing.service.ts#verifyAndApplyPayment for the
  // same pattern), then, only on success, creates the academy exactly as
  // signupAcademy() always has.
  async verifySignupPayment(dto: VerifySignupPaymentDto, logo?: Express.Multer.File) {
    const verification = await this.platformPaystack.verifyTransaction(dto.reference);
    if (verification.status !== 'success') {
      throw new BadRequestException('Payment was not successful');
    }
    return this.signupAcademy(dto, logo);
  }

  // Public — submitted from the SAMS product landing page's "Sign up" form,
  // before the prospective academy exists at all. Not tenant-scoped: there's
  // no academy to attach this to yet.
  async submitLead(dto: SubmitPlatformLeadDto) {
    const lead = await this.prisma.platformLead.create({ data: dto });
    await this.notifyNewLead(dto);
    return lead;
  }

  // Fire-and-forget heads-up to SAMS itself — otherwise a lead just sits
  // there until someone happens to open the platform dashboard's Leads tab.
  // Never throws (see PlatformEmailService#send), so a notification failure
  // can't turn into a failed submission for the prospect.
  private async notifyNewLead(dto: SubmitPlatformLeadDto): Promise<void> {
    const to = this.config.get<string>('SAMS_LEADS_NOTIFICATION_EMAIL') ?? 'adabo@variablexsolutions.com';
    await this.platformEmail.send({
      to,
      subject: `New walkthrough request — ${dto.academyName}`,
      html: `<p>A prospective academy just asked to bring their academy onto SAMS.</p>
        <ul>
          <li><strong>Academy:</strong> ${escapeHtml(dto.academyName)}</li>
          <li><strong>Training location:</strong> ${escapeHtml(dto.trainingLocation)}</li>
          <li><strong>Contact:</strong> ${escapeHtml(dto.contactName)} — ${escapeHtml(dto.contactEmail)} — ${escapeHtml(dto.contactPhone)}</li>
          ${dto.message ? `<li><strong>Message:</strong> ${escapeHtml(dto.message)}</li>` : ''}
        </ul>
        <p>Open the platform dashboard's Leads tab to follow up.</p>`,
    });
  }

  listLeads() {
    return this.prisma.platformLead.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateLeadStatus(id: string, status: InquiryStatus) {
    const lead = await this.prisma.platformLead.findUnique({ where: { id } });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    return this.prisma.platformLead.update({ where: { id }, data: { status } });
  }
}
