import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { AcademyStatus, InquiryStatus, PendingAcademySignup } from '@prisma/client';
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
import { ResumeSignupPaymentDto } from './dto/resume-signup-payment.dto';
import { SignupAcademyDto } from './dto/signup-academy.dto';
import { SubmitPlatformLeadDto } from './dto/submit-platform-lead.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { VerifySignupPaymentDto } from './dto/verify-signup-payment.dto';
import { PlatformAdminJwtPayload } from './platform-admin.types';

// Cadence for an unpaid PendingAcademySignup (see handlePendingSignupCleanupCron
// below) — matches the user-facing promise made in its reminder/warning emails.
const PENDING_SIGNUP_REMINDER_AFTER_DAYS = 2;
const PENDING_SIGNUP_DELETION_WARNING_AFTER_DAYS = 5;
const PENDING_SIGNUP_DELETE_AFTER_DAYS = 7;

// How long a single emailed payment link stays valid for, from the moment
// it's minted — see PendingAcademySignup#paymentLinkExpiresAt.
const PAYMENT_LINK_VALID_HOURS = 72;

function paymentLinkExpiry(): Date {
  return new Date(Date.now() + PAYMENT_LINK_VALID_HOURS * 60 * 60 * 1000);
}

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

  // Per-academy billing summary for a given calendar month: how much SAMS
  // invoiced that academy for the billing period(s) starting in that month,
  // how much of that has actually been paid, and what's still outstanding
  // (PENDING or FAILED invoices). `month` is "YYYY-MM"; defaults to the
  // current month. Like listAcademiesWithHealth, this reads PlatformInvoice/
  // AcademySubscription directly — neither is tenant-scoped/RLS-protected.
  async getBillingSummary(month?: string) {
    const monthStart = month ? new Date(`${month}-01T00:00:00.000Z`) : new Date();
    if (month && Number.isNaN(monthStart.getTime())) {
      throw new BadRequestException('Invalid month — expected "YYYY-MM".');
    }
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const monthEnd = new Date(monthStart);
    monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1);

    const academies = await this.prisma.academy.findMany({ orderBy: { name: 'asc' } });
    const pricing = await this.getPricing();

    const academyRows = await Promise.all(
      academies.map(async (academy) => {
        const invoices = await this.prisma.platformInvoice.findMany({
          where: { academyId: academy.id, periodStart: { gte: monthStart, lt: monthEnd } },
        });
        const amountCharged = invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
        const amountPaid = invoices
          .filter((invoice) => invoice.status === 'PAID')
          .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

        return {
          academyId: academy.id,
          academyName: academy.name,
          amountCharged,
          amountPaid,
          outstanding: amountCharged - amountPaid,
          invoiceCount: invoices.length,
        };
      }),
    );

    const totals = academyRows.reduce(
      (acc, row) => ({
        amountCharged: acc.amountCharged + row.amountCharged,
        amountPaid: acc.amountPaid + row.amountPaid,
        outstanding: acc.outstanding + row.outstanding,
      }),
      { amountCharged: 0, amountPaid: 0, outstanding: 0 },
    );

    return {
      month: monthStart.toISOString().slice(0, 7),
      currency: pricing.currency,
      academies: academyRows,
      totals,
    };
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

  private async getSignupFee(): Promise<number> {
    const pricing = await this.prisma.platformPricing.findUnique({ where: { id: 'default' } });
    const signupFee = Number(pricing?.signupFee ?? 0);
    if (signupFee <= 0) {
      throw new BadRequestException(
        'Self-serve signup is not available yet — ask a platform admin to configure the signup fee.',
      );
    }
    return signupFee;
  }

  // Step one of paid self-serve signup: charge the platform's configured
  // one-time signup fee, then — the instant payment is initialized —
  // persist the academy/admin details as a PendingAcademySignup and email
  // the actual Paystack payment link to the admin. Deliberately does NOT
  // hand the authorizationUrl back to the caller — the browser must never
  // auto-redirect into Paystack straight off this form; the admin has to go
  // to their inbox and follow the link from there, same as every reminder
  // that follows it (see resumeSignupPayment and
  // handlePendingSignupCleanupCron below).
  async initializeSignupPayment(dto: InitializeSignupPaymentDto) {
    const signupFee = await this.getSignupFee();

    const reference = `signup_${randomUUID()}`;
    const result = await this.platformPaystack.initializeTransaction({
      email: dto.adminEmail,
      amount: signupFee,
      reference,
      callbackUrl: dto.callbackUrl,
    });

    const adminPasswordHash = await bcrypt.hash(dto.adminPassword, 10);
    const paymentLinkExpiresAt = paymentLinkExpiry();
    const pending = await this.prisma.pendingAcademySignup.create({
      data: {
        paystackReference: result.reference,
        frontendOrigin: new URL(dto.callbackUrl).origin,
        slug: dto.slug,
        name: dto.name,
        adminEmail: dto.adminEmail,
        adminFirstName: dto.adminFirstName,
        adminLastName: dto.adminLastName,
        adminPasswordHash,
        paymentLinkExpiresAt,
      },
    });

    await this.sendPendingSignupEmail(pending, {
      subject: `Complete payment to activate ${pending.name} on SAMS`,
      intro: `You're almost done bringing <strong>${escapeHtml(pending.name)}</strong> onto SAMS. Pay the
        one-time signup fee using the link below within the next ${PAYMENT_LINK_VALID_HOURS} hours to activate
        your account — the link expires after that.`,
    });

    return {
      adminEmail: pending.adminEmail,
      paymentLinkExpiresAt,
    };
  }

  // Re-initializes payment for an existing PendingAcademySignup from its
  // resume link (sent on day 0, then again by the reminder/deletion-warning
  // emails) — a fresh Paystack reference, since the original is single-use
  // and, days later, likely long expired.
  async resumeSignupPayment(dto: ResumeSignupPaymentDto) {
    const pending = await this.prisma.pendingAcademySignup.findUnique({
      where: { resumeToken: dto.resumeToken },
    });
    if (!pending) {
      throw new NotFoundException('This signup link has expired or already been completed.');
    }

    const signupFee = await this.getSignupFee();
    const reference = `signup_${randomUUID()}`;
    const result = await this.platformPaystack.initializeTransaction({
      email: pending.adminEmail,
      amount: signupFee,
      reference,
      callbackUrl: dto.callbackUrl,
    });

    await this.prisma.pendingAcademySignup.update({
      where: { id: pending.id },
      data: {
        paystackReference: result.reference,
        frontendOrigin: new URL(dto.callbackUrl).origin,
        paymentLinkExpiresAt: paymentLinkExpiry(),
      },
    });

    return { authorizationUrl: result.authorizationUrl, reference: result.reference };
  }

  // Step two: verify the signup fee was actually paid (never trusts the
  // redirect alone — see billing.service.ts#verifyAndApplyPayment for the
  // same pattern), then, only on success, create the academy from the
  // PendingAcademySignup this reference belongs to and discard that row —
  // its job is done either way: the Academy row is now the source of truth.
  async verifySignupPayment(dto: VerifySignupPaymentDto) {
    const pending = await this.prisma.pendingAcademySignup.findUnique({
      where: { paystackReference: dto.reference },
    });
    if (!pending) {
      throw new BadRequestException('We could not find this signup — it may have already been completed.');
    }
    if (pending.paymentLinkExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException(
        'This payment link has expired. We will email a new one, or you can start over from the signup page.',
      );
    }

    const verification = await this.platformPaystack.verifyTransaction(dto.reference);
    if (verification.status !== 'success') {
      throw new BadRequestException('Payment was not successful');
    }

    const { academy } = await this.createAcademyWithAdmin({
      slug: pending.slug,
      name: pending.name,
      adminEmail: pending.adminEmail,
      adminFirstName: pending.adminFirstName,
      adminLastName: pending.adminLastName,
      passwordHash: pending.adminPasswordHash,
      mustChangePassword: false,
      resolveSlugConflict: true,
    });

    await this.prisma.pendingAcademySignup.delete({ where: { id: pending.id } });

    return { academy: { id: academy.id, slug: academy.slug, name: academy.name } };
  }

  private async sendPendingSignupEmail(
    pending: PendingAcademySignup,
    params: { subject: string; intro: string },
  ): Promise<void> {
    const resumeUrl = `${pending.frontendOrigin}/signup/resume?token=${pending.resumeToken}`;
    await this.platformEmail.send({
      to: pending.adminEmail,
      subject: params.subject,
      html: `<p>Hi ${escapeHtml(pending.adminFirstName)},</p>
        <p>${params.intro}</p>
        <p><a href="${resumeUrl}">Continue to payment</a></p>
        <p>If the button doesn't work, copy this link into your browser: ${resumeUrl}</p>`,
    });
  }

  // Runs daily: nudges academies that started signing up but haven't paid
  // yet, then deletes anything that's gone a full week without payment —
  // this table is only ever a staging area, never a real account, so
  // there's nothing to "deactivate" first.
  @Cron('0 8 * * *')
  async handlePendingSignupCleanupCron(): Promise<void> {
    const pendings = await this.prisma.pendingAcademySignup.findMany();
    const now = Date.now();

    for (const pending of pendings) {
      const ageDays = (now - pending.createdAt.getTime()) / (1000 * 60 * 60 * 24);

      if (ageDays >= PENDING_SIGNUP_DELETE_AFTER_DAYS) {
        await this.prisma.pendingAcademySignup.delete({ where: { id: pending.id } });
        continue;
      }

      if (ageDays >= PENDING_SIGNUP_DELETION_WARNING_AFTER_DAYS && !pending.deletionWarningSentAt) {
        await this.sendPendingSignupEmail(pending, {
          subject: `Your SAMS signup for ${pending.name} will be deleted soon`,
          intro: `We still haven't received the one-time signup fee for <strong>${escapeHtml(pending.name)}</strong>.
            If payment isn't completed within ${PENDING_SIGNUP_DELETE_AFTER_DAYS - PENDING_SIGNUP_DELETION_WARNING_AFTER_DAYS}
            more day${PENDING_SIGNUP_DELETE_AFTER_DAYS - PENDING_SIGNUP_DELETION_WARNING_AFTER_DAYS === 1 ? '' : 's'},
            this signup will be deleted and you'll need to start over.`,
        });
        await this.prisma.pendingAcademySignup.update({
          where: { id: pending.id },
          data: { deletionWarningSentAt: new Date() },
        });
        continue;
      }

      if (ageDays >= PENDING_SIGNUP_REMINDER_AFTER_DAYS && !pending.reminderSentAt) {
        await this.sendPendingSignupEmail(pending, {
          subject: `Reminder: finish bringing ${pending.name} onto SAMS`,
          intro: `You started signing <strong>${escapeHtml(pending.name)}</strong> up for SAMS a couple of days ago
            but haven't completed the one-time signup fee yet.`,
        });
        await this.prisma.pendingAcademySignup.update({
          where: { id: pending.id },
          data: { reminderSentAt: new Date() },
        });
      }
    }
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
