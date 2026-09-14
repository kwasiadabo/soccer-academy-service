import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AcademyStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { BillingService } from '../billing/billing.service';
import { PrismaService } from '../prisma/prisma.service';
import { ROLE_NAMES } from '../rbac/permissions.constants';
import { StorageService } from '../storage/storage.service';
import { OnboardAcademyDto } from './dto/onboard-academy.dto';
import { SignupAcademyDto } from './dto/signup-academy.dto';
import { SubmitPlatformLeadDto } from './dto/submit-platform-lead.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { PlatformAdminJwtPayload } from './platform-admin.types';

function generateTemporaryPassword(): string {
  return randomBytes(9).toString('base64url');
}

@Injectable()
export class PlatformAdminService {
  private readonly jwt: JwtService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
    private readonly billing: BillingService,
    private readonly storage: StorageService,
    config: ConfigService,
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
  }) {
    const existing = await this.prisma.academy.findUnique({ where: { slug: params.slug } });
    if (existing) {
      throw new ConflictException(`An academy with slug '${params.slug}' already exists`);
    }

    const academy = await this.prisma.academy.create({
      data: { slug: params.slug, name: params.name, status: 'ACTIVE' },
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
    return { pricePerPlayer: Number(pricing?.pricePerPlayer ?? 20), currency: pricing?.currency ?? 'GHS' };
  }

  async updatePricing(dto: UpdatePricingDto) {
    const pricing = await this.prisma.platformPricing.upsert({
      where: { id: 'default' },
      update: { pricePerPlayer: dto.pricePerPlayer },
      create: { id: 'default', pricePerPlayer: dto.pricePerPlayer },
    });
    return { pricePerPlayer: Number(pricing.pricePerPlayer), currency: pricing.currency };
  }

  // Public — submitted from the SAMS product landing page's "Sign up" form,
  // before the prospective academy exists at all. Not tenant-scoped: there's
  // no academy to attach this to yet.
  submitLead(dto: SubmitPlatformLeadDto) {
    return this.prisma.platformLead.create({ data: dto });
  }

  listLeads() {
    return this.prisma.platformLead.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
