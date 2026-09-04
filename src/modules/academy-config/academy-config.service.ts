import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeasonDto, UpdateSeasonDto } from './dto/season.dto';
import { CreateAgeCategoryDto, UpdateAgeCategoryDto } from './dto/age-category.dto';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { CreateTrainingGroupDto, UpdateTrainingGroupDto } from './dto/training-group.dto';

@Injectable()
export class AcademyConfigService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Seasons ---
  listSeasons() {
    return this.prisma.season.findMany({ orderBy: { startDate: 'desc' } });
  }

  async createSeason(dto: CreateSeasonDto) {
    return this.prisma.season.create({
      data: { name: dto.name, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate) },
    });
  }

  async updateSeason(id: string, dto: UpdateSeasonDto) {
    await this.ensureExists('season', id);
    return this.prisma.season.update({
      where: { id },
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
    return this.prisma.ageCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  createAgeCategory(dto: CreateAgeCategoryDto) {
    return this.prisma.ageCategory.create({
      data: {
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
    return this.prisma.ageCategory.update({ where: { id }, data: dto });
  }

  // --- Teams ---
  listTeams() {
    return this.prisma.team.findMany({
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
    return this.prisma.team.create({
      data: {
        name: dto.name,
        ageCategoryId: dto.ageCategoryId,
        seasonId: dto.seasonId,
        headCoachId: dto.headCoachId,
      },
    });
  }

  async updateTeam(id: string, dto: UpdateTeamDto) {
    await this.ensureExists('team', id);
    return this.prisma.team.update({ where: { id }, data: dto });
  }

  // --- Training Groups ---
  listTrainingGroups() {
    return this.prisma.trainingGroup.findMany({
      include: { team: true, primaryCoach: true },
      orderBy: { name: 'asc' },
    });
  }

  createTrainingGroup(dto: CreateTrainingGroupDto) {
    return this.prisma.trainingGroup.create({
      data: { name: dto.name, teamId: dto.teamId, primaryCoachId: dto.primaryCoachId },
    });
  }

  async updateTrainingGroup(id: string, dto: UpdateTrainingGroupDto) {
    await this.ensureExists('trainingGroup', id);
    return this.prisma.trainingGroup.update({ where: { id }, data: dto });
  }

  private async ensureExists(
    model: 'season' | 'ageCategory' | 'team' | 'trainingGroup',
    id: string,
  ): Promise<void> {
    const finders: Record<typeof model, (id: string) => Promise<unknown>> = {
      season: (recordId) => this.prisma.season.findUnique({ where: { id: recordId } }),
      ageCategory: (recordId) => this.prisma.ageCategory.findUnique({ where: { id: recordId } }),
      team: (recordId) => this.prisma.team.findUnique({ where: { id: recordId } }),
      trainingGroup: (recordId) => this.prisma.trainingGroup.findUnique({ where: { id: recordId } }),
    };

    const record = await finders[model](id);
    if (!record) {
      throw new NotFoundException(`${model} not found`);
    }
  }
}
