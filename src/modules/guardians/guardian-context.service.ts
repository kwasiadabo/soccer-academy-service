import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';

@Injectable()
export class GuardianContextService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async resolveGuardianId(userId: string): Promise<string> {
    const academyId = this.tenantContext.getAcademyId();
    const guardian = await this.prisma.guardian.findFirst({ where: { userId, academyId, deletedAt: null } });
    if (!guardian) {
      throw new ForbiddenException('No guardian profile is linked to this account');
    }
    return guardian.id;
  }

  async resolvePlayerIds(guardianId: string): Promise<string[]> {
    const academyId = this.tenantContext.getAcademyId();
    const links = await this.prisma.playerGuardian.findMany({
      where: { guardianId, academyId },
      select: { playerId: true },
    });
    return links.map((l) => l.playerId);
  }

  async assertOwnsPlayer(guardianId: string, playerId: string): Promise<void> {
    const academyId = this.tenantContext.getAcademyId();
    const link = await this.prisma.playerGuardian.findUnique({
      where: { playerId_guardianId: { playerId, guardianId }, academyId },
    });
    if (!link) {
      throw new ForbiddenException('This player is not linked to your account');
    }
  }
}
