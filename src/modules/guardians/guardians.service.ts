import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ROLE_NAMES } from '../rbac/permissions.constants';
import { GrantGuardianPortalAccessDto } from './dto/grant-portal-access.dto';

@Injectable()
export class GuardiansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async findAll(search?: string) {
    return this.prisma.guardian.findMany({
      where: {
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { players: { include: { player: true } } },
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(id: string) {
    const guardian = await this.prisma.guardian.findFirst({
      where: { id, deletedAt: null },
      include: { players: { include: { player: true } } },
    });
    if (!guardian) {
      throw new NotFoundException('Guardian not found');
    }
    return guardian;
  }

  async grantPortalAccess(id: string, dto: GrantGuardianPortalAccessDto) {
    const guardian = await this.findOne(id);
    if (guardian.userId) {
      throw new BadRequestException('This guardian already has portal access');
    }

    let user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (user) {
      const linkedCoach = await this.prisma.coach.findFirst({ where: { userId: user.id } });
      const linkedGuardian = await this.prisma.guardian.findFirst({ where: { userId: user.id } });
      if (linkedCoach || linkedGuardian) {
        throw new ConflictException('This email is already linked to a different portal profile');
      }

      const parentRole = await this.prisma.role.findUniqueOrThrow({ where: { name: ROLE_NAMES.PARENT } });
      const alreadyHasRole = await this.prisma.userRole.findUnique({
        where: { userId_roleId: { userId: user.id, roleId: parentRole.id } },
      });

      await this.prisma.$transaction([
        ...(alreadyHasRole
          ? []
          : [this.prisma.userRole.create({ data: { userId: user.id, roleId: parentRole.id } })]),
        this.prisma.guardian.update({ where: { id }, data: { userId: user.id } }),
      ]);
    } else {
      const parentRole = await this.prisma.role.findUniqueOrThrow({ where: { name: ROLE_NAMES.PARENT } });
      const passwordHash = await bcrypt.hash(randomBytes(32).toString('hex'), 10);

      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: guardian.firstName,
          lastName: guardian.lastName,
          phone: guardian.phone,
          mustChangePassword: true,
          roles: { create: { roleId: parentRole.id } },
        },
      });

      await this.prisma.guardian.update({ where: { id }, data: { userId: user.id } });
    }

    await this.authService.requestPasswordReset(dto.email);

    return this.findOne(id);
  }
}
