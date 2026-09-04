import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuardianContextService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveGuardianId(userId: string): Promise<string> {
    const guardian = await this.prisma.guardian.findFirst({ where: { userId, deletedAt: null } });
    if (!guardian) {
      throw new ForbiddenException('No guardian profile is linked to this account');
    }
    return guardian.id;
  }

  async resolvePlayerIds(guardianId: string): Promise<string[]> {
    const links = await this.prisma.playerGuardian.findMany({
      where: { guardianId },
      select: { playerId: true },
    });
    return links.map((l) => l.playerId);
  }

  async assertOwnsPlayer(guardianId: string, playerId: string): Promise<void> {
    const link = await this.prisma.playerGuardian.findUnique({
      where: { playerId_guardianId: { playerId, guardianId } },
    });
    if (!link) {
      throw new ForbiddenException('This player is not linked to your account');
    }
  }
}
