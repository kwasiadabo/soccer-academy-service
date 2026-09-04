import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ROLE_NAMES } from '../rbac/permissions.constants';
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

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const roles = await this.resolveRoles(dto.roleNames);
    const mustChangePassword = dto.mustChangePassword ?? dto.roleNames.includes(ROLE_NAMES.PARENT);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        mustChangePassword,
        roles: { create: roles.map((role) => ({ roleId: role.id })) },
      },
      select: userListSelect,
    });

    return this.serialize(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existing.email) {
      const emailTaken = await this.prisma.user.findUnique({ where: { email: dto.email } });
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
