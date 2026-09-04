import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CoachContextService } from '../coaches/coach-context.service';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { RequestUser } from '../auth/types';
import { CreateAssessmentCriteriaInputDto, CreateAssessmentTemplateDto, UpdateAssessmentTemplateDto } from './dto/assessment-template.dto';
import {
  CreateAssessmentRatingInputDto,
  CreatePlayerAssessmentDto,
  UpdatePlayerAssessmentDto,
} from './dto/player-assessment.dto';
import { CreateCoachRemarkDto } from './dto/coach-remark.dto';

const TEMPLATE_INCLUDE = {
  criteria: { orderBy: { sortOrder: 'asc' as const } },
} satisfies Prisma.AssessmentTemplateInclude;

const ASSESSMENT_INCLUDE = {
  ratings: { include: { criteria: true, sessionActivity: true } },
  assessedByCoach: { select: { id: true, firstName: true, lastName: true } },
  template: true,
} satisfies Prisma.PlayerAssessmentInclude;

const ASSESSMENT_OVERSIGHT_INCLUDE = {
  ...ASSESSMENT_INCLUDE,
  player: { select: { id: true, firstName: true, lastName: true, team: { select: { id: true, name: true } } } },
} satisfies Prisma.PlayerAssessmentInclude;

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coachContext: CoachContextService,
  ) {}

  private canViewAll(user: RequestUser): boolean {
    return user.permissions.includes(PERMISSIONS.ASSESSMENTS_VIEW);
  }

  // --- Templates ---
  findAllTemplates() {
    return this.prisma.assessmentTemplate.findMany({
      where: { isActive: true },
      include: TEMPLATE_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async createTemplate(dto: CreateAssessmentTemplateDto) {
    const { criteria, ...rest } = dto;
    return this.prisma.assessmentTemplate.create({
      data: {
        ...rest,
        criteria: criteria?.length ? { create: criteria } : undefined,
      },
      include: TEMPLATE_INCLUDE,
    });
  }

  async updateTemplate(id: string, dto: UpdateAssessmentTemplateDto) {
    await this.getTemplateOrThrow(id);
    return this.prisma.assessmentTemplate.update({ where: { id }, data: dto, include: TEMPLATE_INCLUDE });
  }

  async addCriteria(templateId: string, dto: CreateAssessmentCriteriaInputDto) {
    await this.getTemplateOrThrow(templateId);
    await this.prisma.assessmentCriteria.create({ data: { ...dto, templateId } });
    return this.prisma.assessmentTemplate.findUniqueOrThrow({
      where: { id: templateId },
      include: TEMPLATE_INCLUDE,
    });
  }

  private async getTemplateOrThrow(id: string) {
    const template = await this.prisma.assessmentTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('Assessment template not found');
    }
    return template;
  }

  // --- Player assessments ---
  // Unscoped, academy-wide "recent activity" is capped at 100 rows — but once narrowed to
  // a specific team or session (both naturally small/bounded), show everything that matches
  // rather than silently truncating a head coach's detailed view.
  findAllOversight(teamId?: string, trainingSessionId?: string) {
    const isScoped = !!teamId || !!trainingSessionId;
    return this.prisma.playerAssessment.findMany({
      where: {
        deletedAt: null,
        player: teamId ? { teamId } : undefined,
        trainingSessionId: trainingSessionId || undefined,
      },
      include: ASSESSMENT_OVERSIGHT_INCLUDE,
      orderBy: { assessmentDate: 'desc' },
      take: isScoped ? undefined : 100,
    });
  }

  async findForPlayer(playerId: string, user: RequestUser) {
    return this.prisma.playerAssessment.findMany({
      where: {
        playerId,
        deletedAt: null,
        assessedByCoachId: this.canViewAll(user) ? undefined : await this.coachContext.resolveCoachId(user.userId),
      },
      include: ASSESSMENT_INCLUDE,
      orderBy: { assessmentDate: 'desc' },
    });
  }

  private async assertValidRatings(
    ratings: CreateAssessmentRatingInputDto[],
    templateId: string | null | undefined,
    trainingSessionId: string | null | undefined,
  ) {
    if (templateId) {
      if (ratings.some((r) => r.sessionActivityId)) {
        throw new BadRequestException('Ratings cannot reference a session activity when a template is used');
      }
      if (ratings.some((r) => !r.criteriaId)) {
        throw new BadRequestException('Every rating must reference a criteria when a template is used');
      }
      return;
    }

    if (!trainingSessionId) {
      throw new BadRequestException('trainingSessionId is required when templateId is not provided');
    }
    if (ratings.some((r) => r.criteriaId)) {
      throw new BadRequestException('Ratings cannot reference a criteria without a template');
    }
    if (ratings.some((r) => !r.sessionActivityId)) {
      throw new BadRequestException('Every rating must reference a session activity when no template is used');
    }

    const activityIds = [...new Set(ratings.map((r) => r.sessionActivityId!))];
    const matching = await this.prisma.trainingSessionActivity.findMany({
      where: { id: { in: activityIds }, trainingSessionId },
      select: { id: true },
    });
    if (matching.length !== activityIds.length) {
      throw new BadRequestException('One or more activities do not belong to this training session');
    }
  }

  // A coach may only rate a player if they're assigned to that player's team/group, or —
  // for a session-scoped rating — if they personally conducted that specific session
  // (see CoachContextService#assertOwnsOrConductedSession). This is what stops a Head
  // Coach from rating players outside sessions/matches they were actually in charge of.
  // No other player-scoped activity (assessments, coach remarks) is allowed until the
  // registration fee is paid and the player has moved to ACTIVE — mirrors the same gate
  // already enforced for training sessions (TrainingService#quickMarkAttendance) and team
  // assignment (PlayersService#update / #updateTeamAssignment).
  private async assertPlayerIsActive(playerId: string) {
    const player = await this.prisma.player.findUnique({ where: { id: playerId }, select: { status: true } });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    if (player.status !== 'ACTIVE') {
      throw new BadRequestException('This player cannot be assessed until their registration payment is complete');
    }
  }

  private async assertCanAssessPlayer(coachId: string, playerId: string, trainingSessionId: string | null | undefined) {
    if (trainingSessionId) {
      const session = await this.prisma.trainingSession.findUnique({
        where: { id: trainingSessionId },
        select: { teamId: true, trainingGroupId: true, conductedByCoachId: true },
      });
      if (!session) {
        throw new NotFoundException('Training session not found');
      }
      await this.coachContext.assertOwnsOrConductedSession(coachId, session);
      return;
    }

    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      select: { teamId: true, trainingGroupId: true },
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    await this.coachContext.assertOwnsPlayer(coachId, player);
  }

  async createAssessment(playerId: string, userId: string, dto: CreatePlayerAssessmentDto) {
    const coachId = await this.coachContext.resolveCoachId(userId);
    await this.assertCanAssessPlayer(coachId, playerId, dto.trainingSessionId);
    await this.assertPlayerIsActive(playerId);
    const { ratings, ...rest } = dto;

    await this.assertValidRatings(ratings, dto.templateId, dto.trainingSessionId);

    return this.prisma.playerAssessment.create({
      data: {
        ...rest,
        playerId,
        assessedByCoachId: coachId,
        ratings: { create: ratings },
      },
      include: ASSESSMENT_INCLUDE,
    });
  }

  // Replaces an existing assessment's ratings/notes in place — used when a coach chooses to
  // override a duplicate assessment for the same session/template rather than add a new one.
  async updateAssessment(playerId: string, assessmentId: string, userId: string, dto: UpdatePlayerAssessmentDto) {
    const existing = await this.prisma.playerAssessment.findUnique({ where: { id: assessmentId } });
    if (!existing || existing.playerId !== playerId || existing.deletedAt) {
      throw new NotFoundException('Assessment not found');
    }
    const coachId = await this.coachContext.resolveCoachId(userId);
    await this.assertCanAssessPlayer(coachId, playerId, existing.trainingSessionId);
    const { ratings, ...rest } = dto;

    await this.assertValidRatings(ratings, existing.templateId, existing.trainingSessionId);

    return this.prisma.playerAssessment.update({
      where: { id: assessmentId },
      data: {
        ...rest,
        assessedByCoachId: coachId,
        assessmentDate: new Date(),
        ratings: { deleteMany: {}, create: ratings },
      },
      include: ASSESSMENT_INCLUDE,
    });
  }

  // --- Coach remarks ---
  async findRemarksForPlayer(playerId: string, user: RequestUser) {
    return this.prisma.coachRemark.findMany({
      where: {
        playerId,
        coachId: this.canViewAll(user) ? undefined : await this.coachContext.resolveCoachId(user.userId),
      },
      include: { coach: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRemark(playerId: string, userId: string, dto: CreateCoachRemarkDto) {
    const coachId = await this.coachContext.resolveCoachId(userId);
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      select: { teamId: true, trainingGroupId: true, status: true },
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    await this.coachContext.assertOwnsPlayer(coachId, player);
    if (player.status !== 'ACTIVE') {
      throw new BadRequestException('This player cannot be assessed until their registration payment is complete');
    }
    return this.prisma.coachRemark.create({
      data: { ...dto, playerId, coachId },
      include: { coach: { select: { id: true, firstName: true, lastName: true } } },
    });
  }
}
