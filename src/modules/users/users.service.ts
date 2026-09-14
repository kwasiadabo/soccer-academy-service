import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';

const userListSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  status: true,
  mustChangePassword: true,
  lastLoginAt: true,
  createdAt: true,
  roles: { select: { role: { select: { name: true } } } },
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      select: userListSelect,
      orderBy: { createdAt: 'desc' },
    });
    return users.map(this.serialize);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: userListSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.serialize(user);
  }

  private async resolveRoles(roleNames: string[]) {
    const roles = await this.prisma.role.findMany({ where: { name: { in: roleNames } } });
    if (roles.length !== roleNames.length) {
      const found = new Set(roles.map((r) => r.name));
      const missing = roleNames.filter((n) => !found.has(n));
      throw new NotFoundException(`Unknown role(s): ${missing.join(', ')}`);
    }
    return roles;
  }

  // Every account created here must belong to an already-registered staff
  // member (see CreateUserDto) — firstName/lastName/phone always come from
  // that Coach record, never freely typed, so the two never drift apart.
  async create(dto: CreateUserDto) {
    const coach = await this.prisma.coach.findFirst({ where: { id: dto.coachId, deletedAt: null } });
    if (!coach) {
      throw new NotFoundException('Staff member not found');
    }
    if (coach.userId) {
      throw new BadRequestException('This staff member already has a user account');
    }

    const existing = await this.prisma.user.findFirst({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const roles = await this.resolveRoles(dto.roleNames);
    const mustChangePassword = dto.mustChangePassword ?? true;

    // Two separate top-level calls, not one hand-rolled $transaction: each
    // tenant-scoped model call is already individually wrapped with its own
    // SET LOCAL by PrismaService's tenant-scoping extension (see its
    // $allOperations hook) — a manual `$transaction(async (tx) => ...)`
    // callback runs against a bare, un-extended `tx` client that bypasses
    // that wrapping entirely, which is exactly what caused the RLS
    // foreign-key violation this comment replaced. Same sequencing already
    // used by CoachesService.grantPortalAccess's new-user branch.
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: coach.firstName,
        lastName: coach.lastName,
        phone: coach.phone,
        mustChangePassword,
        roles: { create: roles.map((role) => ({ roleId: role.id })) },
      },
      select: userListSelect,
    });
    await this.prisma.coach.update({ where: { id: coach.id }, data: { userId: created.id } });

    return this.serialize(created);
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existing.email) {
      const emailTaken = await this.prisma.user.findFirst({ where: { email: dto.email } });
      if (emailTaken) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    const roles = dto.roleNames ? await this.resolveRoles(dto.roleNames) : null;

    const user = await this.prisma.$transaction(async (tx) => {
      if (roles) {
        await tx.userRole.deleteMany({ where: { userId: id } });
        await tx.userRole.createMany({ data: roles.map((role) => ({ userId: id, roleId: role.id })) });
      }

      return tx.user.update({
        where: { id },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phone: dto.phone,
          status: dto.status,
        },
        select: userListSelect,
      });
    });

    return this.serialize(user);
  }

  async remove(id: string, requestingUserId: string) {
    if (id === requestingUserId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    const existing = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), refreshTokenHash: null },
    });
  }

  async resetPassword(id: string, dto: ResetUserPasswordDto) {
    const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.password) {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      await this.prisma.user.update({
        where: { id },
        data: { passwordHash, mustChangePassword: true, refreshTokenHash: null },
      });
      return { mode: 'temporary-password' as const };
    }

    await this.authService.requestPasswordReset(user.email);
    return { mode: 'reset-link' as const };
  }

  private serialize(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    status: string;
    mustChangePassword: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    roles: { role: { name: string } }[];
  }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      status: user.status,
      mustChangePassword: user.mustChangePassword,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      roles: user.roles.map((r) => r.role.name),
    };
  }
}
