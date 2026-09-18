import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
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
    private readonly tenantContext: TenantContextService,
  ) {}

  async findAll(search?: string) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.coach.findMany({
      where: {
        academyId,
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
    const academyId = this.tenantContext.getAcademyId();
    const coach = await this.prisma.coach.findFirst({
      where: { id, academyId, deletedAt: null },
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
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.coach.create({ data: { ...dto, academyId } });
  }

  // Suspending a coach (isActive: false) also locks their portal login by suspending the
  // linked User account — AuthService already rejects login/refresh for any non-ACTIVE
  // user, so this is what actually stops them, not just a cosmetic flag. Coaches without
  // portal access yet (userId is null) just get the flag with nothing further to touch.
  async update(id: string, dto: UpdateCoachDto) {
    const coach = await this.findOne(id);
    const academyId = coach.academyId;
    const { isActive, ...rest } = dto;
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.coach.update({ where: { id, academyId }, data: { ...rest, isActive } });
      if (isActive !== undefined && coach.userId) {
        await tx.user.update({
          where: { id: coach.userId, academyId },
          data: { status: isActive ? 'ACTIVE' : 'SUSPENDED' },
        });
      }
      return updated;
    });
  }

  async grantPortalAccess(id: string, dto: GrantCoachPortalAccessDto) {
    const coach = await this.findOne(id);
    const academyId = coach.academyId;
    if (coach.userId) {
      throw new BadRequestException('This coach already has portal access');
    }

    let user = await this.prisma.user.findFirst({ where: { email: dto.email, academyId } });

    if (user) {
      const alreadyLinked = await this.prisma.coach.findFirst({ where: { userId: user.id, academyId } });
      const linkedGuardian = await this.prisma.guardian.findFirst({ where: { userId: user.id, academyId } });
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
        this.prisma.coach.update({ where: { id, academyId }, data: { userId: user.id } }),
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
          academyId,
          email: dto.email,
          passwordHash,
          firstName: coach.firstName,
          lastName: coach.lastName,
          phone: coach.phone,
          roles: { create: roles.map((role) => ({ roleId: role.id })) },
        },
      });

      await this.prisma.coach.update({ where: { id, academyId }, data: { userId: user.id } });
    }

    await this.authService.requestPasswordReset(dto.email);

    return this.findOne(id);
  }

  async addQualification(coachId: string, dto: CreateCoachQualificationDto) {
    const coach = await this.findOne(coachId);
    await this.prisma.coachQualification.create({
      data: {
        academyId: coach.academyId,
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
    const coach = await this.findOne(coachId);
    if (!dto.teamId && !dto.trainingGroupId) {
      throw new BadRequestException('Specify a team or a training group to assign this coach to');
    }
    // Verify the team/training group being assigned actually belongs to this coach's
    // academy — coachId alone doesn't guarantee that without this check.
    const academyId = coach.academyId;
    if (dto.teamId) {
      const team = await this.prisma.team.findFirst({ where: { id: dto.teamId, academyId } });
      if (!team) throw new NotFoundException('Team not found');
    }
    if (dto.trainingGroupId) {
      const group = await this.prisma.trainingGroup.findFirst({ where: { id: dto.trainingGroupId, academyId } });
      if (!group) throw new NotFoundException('Training group not found');
    }
    await this.prisma.coachAssignment.create({
      data: {
        academyId,
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
    const coach = await this.findOne(coachId);
    const assignment = await this.prisma.coachAssignment.findFirst({
      where: { id: assignmentId, coachId, academyId: coach.academyId },
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
