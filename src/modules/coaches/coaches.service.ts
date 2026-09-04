import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateCoachDto, UpdateCoachDto } from './dto/coach.dto';
import { GrantCoachPortalAccessDto } from './dto/grant-portal-access.dto';
import { CreateCoachQualificationDto } from './dto/coach-qualification.dto';
import { CreateCoachAssignmentDto, EndCoachAssignmentDto } from './dto/coach-assignment.dto';

@Injectable()
export class CoachesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async findAll(search?: string) {
    return this.prisma.coach.findMany({
      where: {
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { user: { select: { id: true, email: true, roles: { select: { role: { select: { name: true } } } } } } },
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(id: string) {
    const coach = await this.prisma.coach.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: { select: { id: true, email: true, roles: { select: { role: { select: { name: true } } } } } },
        qualifications: true,
        assignments: { include: { team: true, trainingGroup: true } },
      },
    });
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }
    return coach;
  }

  create(dto: CreateCoachDto) {
    return this.prisma.coach.create({ data: dto });
  }

  // Suspending a coach (isActive: false) also locks their portal login by suspending the
  // linked User account — AuthService already rejects login/refresh for any non-ACTIVE
  // user, so this is what actually stops them, not just a cosmetic flag. Coaches without
  // portal access yet (userId is null) just get the flag with nothing further to touch.
  async update(id: string, dto: UpdateCoachDto) {
    const coach = await this.findOne(id);
    const { isActive, ...rest } = dto;
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.coach.update({ where: { id }, data: { ...rest, isActive } });
      if (isActive !== undefined && coach.userId) {
        await tx.user.update({
          where: { id: coach.userId },
          data: { status: isActive ? 'ACTIVE' : 'SUSPENDED' },
        });
      }
      return updated;
    });
  }

  async grantPortalAccess(id: string, dto: GrantCoachPortalAccessDto) {
    const coach = await this.findOne(id);
    if (coach.userId) {
      throw new BadRequestException('This coach already has portal access');
    }

    let user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (user) {
      const alreadyLinked = await this.prisma.coach.findFirst({ where: { userId: user.id } });
      const linkedGuardian = await this.prisma.guardian.findFirst({ where: { userId: user.id } });
      if (alreadyLinked || linkedGuardian) {
        throw new ConflictException('This email is already linked to a different portal profile');
      }

      const roles = await this.prisma.role.findMany({ where: { name: { in: dto.roleNames } } });
      const existingRoleIds = new Set(
        (await this.prisma.userRole.findMany({ where: { userId: user.id } })).map((r) => r.roleId),
      );
      const rolesToAdd = roles.filter((r) => !existingRoleIds.has(r.id));

      await this.prisma.$transaction([
        this.prisma.userRole.createMany({
          data: rolesToAdd.map((role) => ({ userId: user!.id, roleId: role.id })),
        }),
        this.prisma.coach.update({ where: { id }, data: { userId: user.id } }),
      ]);
    } else {
      const roles = await this.prisma.role.findMany({ where: { name: { in: dto.roleNames } } });
      if (roles.length !== dto.roleNames.length) {
        const found = new Set(roles.map((r) => r.name));
        const missing = dto.roleNames.filter((n) => !found.has(n));
        throw new NotFoundException(`Unknown role(s): ${missing.join(', ')}`);
      }

      const passwordHash = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: coach.firstName,
          lastName: coach.lastName,
          phone: coach.phone,
          roles: { create: roles.map((role) => ({ roleId: role.id })) },
        },
      });

      await this.prisma.coach.update({ where: { id }, data: { userId: user.id } });
    }

    await this.authService.requestPasswordReset(dto.email);

    return this.findOne(id);
  }

  async addQualification(coachId: string, dto: CreateCoachQualificationDto) {
    await this.findOne(coachId);
    await this.prisma.coachQualification.create({
      data: {
        coachId,
        title: dto.title,
        issuingBody: dto.issuingBody,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      },
    });
    return this.findOne(coachId);
  }

  async addAssignment(coachId: string, dto: CreateCoachAssignmentDto) {
    await this.findOne(coachId);
    if (!dto.teamId && !dto.trainingGroupId) {
      throw new BadRequestException('Specify a team or a training group to assign this coach to');
    }
    await this.prisma.coachAssignment.create({
      data: {
        coachId,
        teamId: dto.teamId,
        trainingGroupId: dto.trainingGroupId,
        role: dto.role,
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
      },
    });
    return this.findOne(coachId);
  }

  async endAssignment(coachId: string, assignmentId: string, dto: EndCoachAssignmentDto) {
    await this.findOne(coachId);
    const assignment = await this.prisma.coachAssignment.findFirst({
      where: { id: assignmentId, coachId },
    });
    if (!assignment) {
      throw new NotFoundException('Coach assignment not found');
    }
    await this.prisma.coachAssignment.update({
      where: { id: assignmentId },
      data: { effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : new Date() },
    });
    return this.findOne(coachId);
  }
}
