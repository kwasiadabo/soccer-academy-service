import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CreateSeasonDto, UpdateSeasonDto } from './dto/season.dto';
import { CreateAgeCategoryDto, UpdateAgeCategoryDto } from './dto/age-category.dto';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { CreateTrainingGroupDto, UpdateTrainingGroupDto } from './dto/training-group.dto';

@Injectable()
export class AcademyConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  // --- Seasons ---
  listSeasons() {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.season.findMany({ where: { academyId }, orderBy: { startDate: 'desc' } });
  }

  async createSeason(dto: CreateSeasonDto) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.season.create({
      data: { academyId, name: dto.name, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate) },
    });
  }

  async updateSeason(id: string, dto: UpdateSeasonDto) {
    await this.ensureExists('season', id);
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.season.update({
      where: { id, academyId },
      data: {
        name: dto.name,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isActive: dto.isActive,
      },
    });
  }

  // --- Age Categories ---
  listAgeCategories() {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.ageCategory.findMany({ where: { academyId }, orderBy: { sortOrder: 'asc' } });
  }

  createAgeCategory(dto: CreateAgeCategoryDto) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.ageCategory.create({
      data: {
        academyId,
        name: dto.name,
        code: dto.code,
        minAge: dto.minAge,
        maxAge: dto.maxAge,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async updateAgeCategory(id: string, dto: UpdateAgeCategoryDto) {
    await this.ensureExists('ageCategory', id);
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.ageCategory.update({ where: { id, academyId }, data: dto });
  }

  // --- Teams ---
  listTeams() {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.team.findMany({
      where: { academyId },
      include: {
        ageCategory: true,
        season: true,
        headCoach: true,
        // Only currently-active assignments (effectiveTo: null) — an ended assignment
        // shouldn't still show as "assigned" on the team-and-coaches overview.
        coachAssignments: {
          where: { effectiveTo: null },
          include: { coach: true },
          orderBy: { effectiveFrom: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  createTeam(dto: CreateTeamDto) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.team.create({
      data: {
        academyId,
        name: dto.name,
        ageCategoryId: dto.ageCategoryId,
        seasonId: dto.seasonId,
        headCoachId: dto.headCoachId,
      },
    });
  }

  async updateTeam(id: string, dto: UpdateTeamDto) {
    await this.ensureExists('team', id);
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.team.update({ where: { id, academyId }, data: dto });
  }

  // --- Training Groups ---
  listTrainingGroups() {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.trainingGroup.findMany({
      where: { academyId },
      include: { team: true, primaryCoach: true },
      orderBy: { name: 'asc' },
    });
  }

  createTrainingGroup(dto: CreateTrainingGroupDto) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.trainingGroup.create({
      data: { academyId, name: dto.name, teamId: dto.teamId, primaryCoachId: dto.primaryCoachId },
    });
  }

  async updateTrainingGroup(id: string, dto: UpdateTrainingGroupDto) {
    await this.ensureExists('trainingGroup', id);
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.trainingGroup.update({ where: { id, academyId }, data: dto });
  }

  private async ensureExists(
    model: 'season' | 'ageCategory' | 'team' | 'trainingGroup',
    id: string,
  ): Promise<void> {
    const academyId = this.tenantContext.getAcademyId();
    const finders: Record<typeof model, (id: string) => Promise<unknown>> = {
      season: (recordId) => this.prisma.season.findFirst({ where: { id: recordId, academyId } }),
      ageCategory: (recordId) => this.prisma.ageCategory.findFirst({ where: { id: recordId, academyId } }),
      team: (recordId) => this.prisma.team.findFirst({ where: { id: recordId, academyId } }),
      trainingGroup: (recordId) => this.prisma.trainingGroup.findFirst({ where: { id: recordId, academyId } }),
    };

    const record = await finders[model](id);
    if (!record) {
      throw new NotFoundException(`${model} not found`);
    }
  }
}
