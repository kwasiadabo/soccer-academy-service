import { BadRequestException, Injectable } from '@nestjs/common';
import { Academy } from '@prisma/client';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateAcademySettingsDto } from './dto/update-academy-settings.dto';

export interface PublicAcademyBranding {
  name: string;
  logoUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  trainingLocation: string | null;
}

export interface AcademySettingsView {
  name: string;
  brandName: string;
  logoUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  trainingLocation: string | null;
}

@Injectable()
export class AcademiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
    private readonly storage: StorageService,
  ) {}

  findBySlug(slug: string): Promise<Academy | null> {
    return this.prisma.academy.findUnique({ where: { slug } });
  }

  findById(id: string): Promise<Academy | null> {
    return this.prisma.academy.findUnique({ where: { id } });
  }

  // Unauthenticated — powers the login screen and any public marketing page's
  // branding before a visitor has signed in at all.
  async getPublicBranding(): Promise<PublicAcademyBranding> {
    const academyId = this.tenantContext.getAcademyId();
    const settings = await this.prisma.academySettings.findUnique({ where: { academyId } });
    const academy = await this.findById(academyId);
    return {
      name: settings?.brandName ?? academy?.name ?? 'Soccer Academy',
      logoUrl: settings?.logoUrl ?? null,
      // Falls back to the academy's own operational email account (see
      // AcademySettings.emailUser) for academies set up before contactEmail
      // existed as its own field.
      contactEmail: settings?.contactEmail ?? settings?.emailUser ?? null,
      contactPhone: settings?.contactPhone ?? null,
      trainingLocation: settings?.trainingLocation ?? null,
    };
  }

  // Authenticated — an Admin viewing their own academy's branding to edit it,
  // as opposed to getPublicBranding()'s unauthenticated, display-only shape.
  // Everything here was originally set once at signup (see SignupAcademyDto) —
  // this is where it can be changed afterward. The subdomain slug is
  // deliberately not included: it's the actual lookup key every login and
  // bookmark depends on, so it stays fixed once chosen.
  async getSettings(): Promise<AcademySettingsView> {
    const academyId = this.tenantContext.getAcademyId();
    const [settings, academy] = await Promise.all([
      this.prisma.academySettings.findUnique({ where: { academyId } }),
      this.findById(academyId),
    ]);
    return {
      name: academy?.name ?? '',
      brandName: settings?.brandName ?? academy?.name ?? '',
      logoUrl: settings?.logoUrl ?? null,
      contactEmail: settings?.contactEmail ?? null,
      contactPhone: settings?.contactPhone ?? null,
      trainingLocation: settings?.trainingLocation ?? null,
    };
  }

  async updateSettings(dto: UpdateAcademySettingsDto, logo?: Express.Multer.File): Promise<AcademySettingsView> {
    if (logo && !logo.mimetype.startsWith('image/')) {
      throw new BadRequestException('Logo must be an image file');
    }

    const academyId = this.tenantContext.getAcademyId();
    let logoUrl: string | undefined;
    if (logo) {
      const stored = await this.storage.save(logo.originalname, logo.mimetype, logo.buffer);
      logoUrl = this.storage.resolvePath(stored.storageKey);
    }

    // Academy isn't a tenant-scoped/RLS-protected model (it's the tenant root
    // itself — see the Tenancy note in schema.prisma), so this and the
    // AcademySettings update below are two plain sequential calls, not a
    // transaction — same pattern already used for multi-write flows elsewhere
    // in this module (e.g. PlatformAdminService.createAcademyWithAdmin).
    const [academy, settings] = await Promise.all([
      dto.name
        ? this.prisma.academy.update({ where: { id: academyId }, data: { name: dto.name } })
        : this.findById(academyId),
      this.prisma.academySettings.update({
        where: { academyId },
        data: {
          ...(dto.brandName ? { brandName: dto.brandName } : {}),
          ...(logoUrl ? { logoUrl } : {}),
          ...(dto.contactEmail ? { contactEmail: dto.contactEmail } : {}),
          ...(dto.contactPhone ? { contactPhone: dto.contactPhone } : {}),
          ...(dto.trainingLocation ? { trainingLocation: dto.trainingLocation } : {}),
        },
      }),
    ]);

    return {
      name: academy?.name ?? '',
      brandName: settings.brandName,
      logoUrl: settings.logoUrl,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      trainingLocation: settings.trainingLocation,
    };
  }
}
