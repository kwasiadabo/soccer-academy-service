import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AttendanceStatus, Prisma, TrainingApprovalStatus } from '@prisma/client';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../prisma/prisma.service';
import { CoachContextService } from '../coaches/coach-context.service';
import { EmailService } from '../messaging/email.service';
import { SmsService } from '../messaging/sms.service';
import { PERMISSIONS, ROLE_NAMES } from '../rbac/permissions.constants';
import { RequestUser } from '../auth/types';
import {
  CreateTrainingActivityInputDto,
  CreateTrainingPlanDto,
  UpdateTrainingPlanDto,
} from './dto/training-plan.dto';
import { UpdateTrainingActivityDto } from './dto/training-activity.dto';
import { TrainingPlanDecisionDto } from './dto/training-decision.dto';
import { CreateTrainingSessionDto, RecordAttendanceDto, UpdateTrainingSessionDto } from './dto/training-session.dto';
import { UpsertActivityMarksDto } from './dto/training-activity-mark.dto';
import { CreateSessionActivityDto } from './dto/training-session-activity.dto';
import { UpdateTrainingScheduleDto } from './dto/training-schedule.dto';

const EDITABLE_STATUSES: TrainingApprovalStatus[] = ['DRAFT', 'CHANGES_REQUESTED'];

const PLAN_INCLUDE = {
  activities: { orderBy: { sortOrder: 'asc' as const } },
  approvals: { orderBy: { submittedAt: 'desc' as const } },
  coach: true,
  team: true,
  trainingGroup: true,
} satisfies Prisma.TrainingPlanInclude;

const SESSION_INCLUDE = {
  team: true,
  trainingGroup: true,
  trainingPlan: true,
  conductedByCoach: true,
  attendance: {
    include: {
      player: { select: { id: true, firstName: true, lastName: true, playerCode: true, photoDocumentId: true } },
      recordedByUser: { select: { id: true, firstName: true, lastName: true } },
    },
  },
  sessionActivities: { orderBy: { sortOrder: 'asc' as const } },
} satisfies Prisma.TrainingSessionInclude;

// Training is a recurring academy-wide fixture — by default every Saturday, 08:00-10:00 —
// so sessions are auto-provisioned per team rather than manually scheduled. The Head
// Coach/Admin can change the day/time/location (see get/updateSchedule below); these are
// only the fallback used if an academy somehow has no AcademySettings row.
const DEFAULT_TRAINING_DAY_OF_WEEK = 6; // 0 = Sunday .. 6 = Saturday
const DEFAULT_TRAINING_START_TIME = '08:00';
const DEFAULT_TRAINING_END_TIME = '10:00';

export interface TrainingSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location: string | null;
}

@Injectable()
export class TrainingService {
  private readonly logger = new Logger(TrainingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coachContext: CoachContextService,
    private readonly email: EmailService,
    private readonly sms: SmsService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private canApprove(user: RequestUser): boolean {
    return user.permissions.includes(PERMISSIONS.TRAINING_APPROVE);
  }

  // Coaches don't hold ACADEMY_CONFIG_VIEW, so this is their only way to see which teams
  // exist when picking one for a new plan/session/match. Scoped to the coach's own assigned
  // team(s) so the picker defaults to what they actually manage; falls back to every active
  // team if they have none assigned yet, so they're never stuck with an empty picker.
  async listTeamsForPicker(user: RequestUser) {
    const academyId = this.tenantContext.getAcademyId();
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      const teamIds = await this.coachContext.getAssignedTeamIds(coachId);
      if (teamIds.length > 0) {
        return this.prisma.team.findMany({
          where: { academyId, isActive: true, id: { in: teamIds } },
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        });
      }
    }

    return this.prisma.team.findMany({
      where: { academyId, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  private async getPlanOrThrow(id: string) {
    const academyId = this.tenantContext.getAcademyId();
    const plan = await this.prisma.trainingPlan.findFirst({ where: { id, academyId }, include: PLAN_INCLUDE });
    if (!plan) {
      throw new NotFoundException('Training plan not found');
    }
    return plan;
  }

  private assertEditable(approvalStatus: TrainingApprovalStatus) {
    if (!EDITABLE_STATUSES.includes(approvalStatus)) {
      throw new BadRequestException(`Cannot edit a training plan in status ${approvalStatus}`);
    }
  }

  // Every "own" endpoint resolves the caller's Coach.id and either scopes the
  // query by it (reads) or asserts plan.coachId matches it (writes) — see
  // CoachContextService. Handlers reachable by both TRAINING_MANAGE_OWN and
  // TRAINING_APPROVE (via @RequireAnyPermission) branch here on which one the
  // caller actually holds, rather than in the guard.
  async findAllPlans(user: RequestUser, status?: TrainingApprovalStatus) {
    const academyId = this.tenantContext.getAcademyId();
    if (this.canApprove(user)) {
      return this.prisma.trainingPlan.findMany({
        where: { academyId, approvalStatus: status },
        include: PLAN_INCLUDE,
        orderBy: { scheduledDate: 'desc' },
      });
    }

    const coachId = await this.coachContext.resolveCoachId(user.userId);
    return this.prisma.trainingPlan.findMany({
      where: { academyId, coachId, approvalStatus: status },
      include: PLAN_INCLUDE,
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async findOnePlan(id: string, user: RequestUser) {
    const plan = await this.getPlanOrThrow(id);
    if (!this.canApprove(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      if (plan.coachId !== coachId) {
        throw new ForbiddenException('You do not have access to this training plan');
      }
    }
    return plan;
  }

  async createPlan(userId: string, dto: CreateTrainingPlanDto) {
    const academyId = this.tenantContext.getAcademyId();
    const coachId = await this.coachContext.resolveCoachId(userId);
    const { activities, scheduledDate, ...rest } = dto;

    const plan = await this.prisma.trainingPlan.create({
      data: {
        ...rest,
        academyId,
        scheduledDate: new Date(scheduledDate),
        coachId,
        approvalStatus: 'DRAFT',
        activities: activities?.length ? { create: activities.map((a) => ({ ...a, academyId })) } : undefined,
      },
      include: PLAN_INCLUDE,
    });
    return plan;
  }

  private async assertOwnPlan(id: string, userId: string) {
    const coachId = await this.coachContext.resolveCoachId(userId);
    const plan = await this.getPlanOrThrow(id);
    if (plan.coachId !== coachId) {
      throw new ForbiddenException('You do not have access to this training plan');
    }
    return plan;
  }

  async updatePlan(id: string, userId: string, dto: UpdateTrainingPlanDto) {
    const plan = await this.assertOwnPlan(id, userId);
    this.assertEditable(plan.approvalStatus);

    const { scheduledDate, ...rest } = dto;
    await this.prisma.trainingPlan.update({
      where: { id, academyId: plan.academyId },
      data: { ...rest, scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined },
    });
    return this.getPlanOrThrow(id);
  }

  async addActivity(planId: string, userId: string, dto: CreateTrainingActivityInputDto) {
    const plan = await this.assertOwnPlan(planId, userId);
    this.assertEditable(plan.approvalStatus);

    await this.prisma.trainingActivity.create({
      data: { ...dto, trainingPlanId: planId, academyId: plan.academyId },
    });
    return this.getPlanOrThrow(planId);
  }

  async updateActivity(planId: string, activityId: string, userId: string, dto: UpdateTrainingActivityDto) {
    const plan = await this.assertOwnPlan(planId, userId);
    this.assertEditable(plan.approvalStatus);

    const activity = await this.prisma.trainingActivity.findFirst({
      where: { id: activityId, trainingPlanId: planId, academyId: plan.academyId },
    });
    if (!activity) {
      throw new NotFoundException('Training activity not found');
    }

    await this.prisma.trainingActivity.update({ where: { id: activityId }, data: dto });
    return this.getPlanOrThrow(planId);
  }

  async removeActivity(planId: string, activityId: string, userId: string) {
    const plan = await this.assertOwnPlan(planId, userId);
    this.assertEditable(plan.approvalStatus);

    const activity = await this.prisma.trainingActivity.findFirst({
      where: { id: activityId, trainingPlanId: planId, academyId: plan.academyId },
    });
    if (!activity) {
      throw new NotFoundException('Training activity not found');
    }

    await this.prisma.trainingActivity.delete({ where: { id: activityId } });
    return this.getPlanOrThrow(planId);
  }

  // --- Activity Marks ---
  private async getActivityOrThrow(activityId: string) {
    const academyId = this.tenantContext.getAcademyId();
    const activity = await this.prisma.trainingActivity.findFirst({
      where: { id: activityId, academyId },
      include: { trainingPlan: true },
    });
    if (!activity) {
      throw new NotFoundException('Training activity not found');
    }
    return activity;
  }

  private async assertMarksAccess(user: RequestUser, plan: { teamId: string; trainingGroupId: string | null }) {
    if (!this.coachContext.isCoachOnly(user)) return;
    const coachId = await this.coachContext.resolveCoachId(user.userId);
    await this.coachContext.assertOwnsPlan(coachId, plan);
  }

  async getActivityMarks(activityId: string, user: RequestUser) {
    const academyId = this.tenantContext.getAcademyId();
    const activity = await this.getActivityOrThrow(activityId);
    await this.assertMarksAccess(user, activity.trainingPlan);

    const [roster, marks] = await Promise.all([
      this.rosterFor(activity.trainingPlan),
      this.prisma.trainingActivityMark.findMany({
        where: { trainingActivityId: activityId, academyId },
        include: { ratedByCoach: { select: { id: true, firstName: true, lastName: true } } },
      }),
    ]);

    return { activity, roster, marks };
  }

  async upsertActivityMarks(activityId: string, user: RequestUser, dto: UpsertActivityMarksDto) {
    const academyId = this.tenantContext.getAcademyId();
    const activity = await this.getActivityOrThrow(activityId);
    await this.assertMarksAccess(user, activity.trainingPlan);
    const ratedByCoachId = await this.coachContext.resolveCoachId(user.userId);

    await this.prisma.$transaction(
      dto.records.map((record) =>
        this.prisma.trainingActivityMark.upsert({
          where: { trainingActivityId_playerId: { trainingActivityId: activityId, playerId: record.playerId } },
          create: {
            academyId,
            trainingActivityId: activityId,
            playerId: record.playerId,
            ratedByCoachId,
            rating: record.rating,
            remarks: record.remarks,
          },
          update: { rating: record.rating, remarks: record.remarks, ratedByCoachId },
        }),
      ),
    );

    return this.getActivityMarks(activityId, user);
  }

  async getPlayerMarks(playerId: string, user: RequestUser) {
    const academyId = this.tenantContext.getAcademyId();
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      const player = await this.prisma.player.findFirst({
        where: { id: playerId, academyId },
        select: { teamId: true, trainingGroupId: true },
      });
      if (!player) {
        throw new NotFoundException('Player not found');
      }
      await this.coachContext.assertOwnsPlayer(coachId, player);
    }

    return this.prisma.trainingActivityMark.findMany({
      where: { playerId, academyId },
      include: {
        trainingActivity: {
          include: { trainingPlan: { select: { title: true, scheduledDate: true } } },
        },
        ratedByCoach: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTeamMarks(teamId: string, user: RequestUser) {
    const academyId = this.tenantContext.getAcademyId();
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      await this.coachContext.assertOwnsTeam(coachId, teamId);
    }

    return this.prisma.trainingActivityMark.findMany({
      where: { academyId, player: { teamId } },
      select: {
        id: true,
        playerId: true,
        rating: true,
        createdAt: true,
        trainingActivityId: true,
        player: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submit(id: string, userId: string) {
    const plan = await this.assertOwnPlan(id, userId);
    if (!EDITABLE_STATUSES.includes(plan.approvalStatus)) {
      throw new BadRequestException(`Cannot submit a training plan in status ${plan.approvalStatus}`);
    }

    await this.prisma.$transaction([
      this.prisma.trainingPlan.update({ where: { id, academyId: plan.academyId }, data: { approvalStatus: 'SUBMITTED' } }),
      this.prisma.trainingApproval.create({
        data: { academyId: plan.academyId, trainingPlanId: id, submittedByUserId: userId },
      }),
    ]);
    return this.getPlanOrThrow(id);
  }

  async decide(id: string, reviewerUserId: string, dto: TrainingPlanDecisionDto) {
    const plan = await this.getPlanOrThrow(id);
    if (plan.approvalStatus !== 'SUBMITTED') {
      throw new BadRequestException(`Cannot record a decision for a plan in status ${plan.approvalStatus}`);
    }

    const pendingApproval = await this.prisma.trainingApproval.findFirst({
      where: { trainingPlanId: id, decision: 'SUBMITTED', academyId: plan.academyId },
      orderBy: { submittedAt: 'desc' },
    });
    if (!pendingApproval) {
      throw new NotFoundException('No pending approval found for this plan');
    }

    await this.prisma.$transaction([
      this.prisma.trainingPlan.update({ where: { id, academyId: plan.academyId }, data: { approvalStatus: dto.decision } }),
      this.prisma.trainingApproval.update({
        where: { id: pendingApproval.id },
        data: {
          reviewedByUserId: reviewerUserId,
          reviewedAt: new Date(),
          decision: dto.decision,
          comments: dto.comments,
        },
      }),
    ]);
    return this.getPlanOrThrow(id);
  }

  // --- Sessions ---
  private async getSessionOrThrow(id: string) {
    const academyId = this.tenantContext.getAcademyId();
    const session = await this.prisma.trainingSession.findFirst({ where: { id, academyId }, include: SESSION_INCLUDE });
    if (!session) {
      throw new NotFoundException('Training session not found');
    }
    return session;
  }

  // A plain Coach may only touch a session they personally created; Head Coach/Admin
  // (via TRAINING_SESSIONS_MANAGE/TRAINING_MANAGE_OWN without being coach-only) can edit
  // any session — same bypass pattern as assertCanManageSession below.
  private async assertOwnSession(id: string, user: RequestUser) {
    const session = await this.getSessionOrThrow(id);
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      if (session.conductedByCoachId !== coachId) {
        throw new ForbiddenException('You do not have access to this training session');
      }
    }
    return session;
  }

  private async rosterFor(session: { teamId: string; trainingGroupId: string | null }) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.player.findMany({
      where: {
        academyId,
        status: 'ACTIVE',
        deletedAt: null,
        teamId: session.teamId,
        trainingGroupId: session.trainingGroupId ?? undefined,
      },
      select: { id: true, firstName: true, lastName: true, playerCode: true, photoDocumentId: true },
      orderBy: { lastName: 'asc' },
    });
  }

  // Reads the academy's recurring weekly training fixture (falls back to the
  // every-Saturday-08:00-10:00 defaults if this academy somehow has no settings row).
  async getSchedule(): Promise<TrainingSchedule> {
    const academyId = this.tenantContext.getAcademyId();
    const settings = await this.prisma.academySettings.findUnique({ where: { academyId } });
    return {
      dayOfWeek: settings?.trainingDayOfWeek ?? DEFAULT_TRAINING_DAY_OF_WEEK,
      startTime: settings?.trainingStartTime ?? DEFAULT_TRAINING_START_TIME,
      endTime: settings?.trainingEndTime ?? DEFAULT_TRAINING_END_TIME,
      location: settings?.trainingLocation ?? null,
    };
  }

  async updateSchedule(dto: UpdateTrainingScheduleDto): Promise<TrainingSchedule> {
    const current = await this.getSchedule();
    const startTime = dto.startTime ?? current.startTime;
    const endTime = dto.endTime ?? current.endTime;
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    const academyId = this.tenantContext.getAcademyId();
    await this.prisma.academySettings.update({
      where: { academyId },
      data: {
        ...(dto.dayOfWeek !== undefined ? { trainingDayOfWeek: dto.dayOfWeek } : {}),
        ...(dto.startTime ? { trainingStartTime: dto.startTime } : {}),
        ...(dto.endTime ? { trainingEndTime: dto.endTime } : {}),
        ...(dto.location !== undefined ? { trainingLocation: dto.location } : {}),
      },
    });
    return this.getSchedule();
  }

  // The current week's fixture session should always be there to take attendance against —
  // not just once the configured day actually arrives — so materialize it for every relevant
  // team up front, any day of the week, rather than waiting for someone to hit
  // quick-mark-attendance or the /sessions/saturday endpoint for a given team.
  private async ensureThisWeeksWeeklySessions(teamIds: string[], schedule: TrainingSchedule) {
    if (teamIds.length === 0) {
      return;
    }
    await Promise.all(teamIds.map((teamId) => this.getOrCreateWeeklySessionRecord(teamId, schedule)));
  }

  // Training is a shared academy-wide fixture (every Saturday, by default), so Receptionist/
  // Head Coach/Admin see every session — but a plain Coach is scoped to only their own
  // team(s)/group(s).
  async findAllSessions(user: RequestUser) {
    const academyId = this.tenantContext.getAcademyId();
    const schedule = await this.getSchedule();
    if (!this.coachContext.isCoachOnly(user)) {
      const allTeamIds = await this.prisma.team.findMany({ where: { academyId, isActive: true }, select: { id: true } });
      await this.ensureThisWeeksWeeklySessions(allTeamIds.map((t) => t.id), schedule);
      return this.prisma.trainingSession.findMany({ where: { academyId }, include: SESSION_INCLUDE, orderBy: { date: 'desc' } });
    }

    const coachId = await this.coachContext.resolveCoachId(user.userId);
    const [teamIds, trainingGroupIds] = await Promise.all([
      this.coachContext.getAssignedTeamIds(coachId),
      this.coachContext.getAssignedTrainingGroupIds(coachId),
    ]);
    if (teamIds.length === 0 && trainingGroupIds.length === 0) {
      return [];
    }
    await this.ensureThisWeeksWeeklySessions(teamIds, schedule);

    return this.prisma.trainingSession.findMany({
      where: {
        academyId,
        OR: [
          teamIds.length > 0 ? { teamId: { in: teamIds } } : undefined,
          trainingGroupIds.length > 0 ? { trainingGroupId: { in: trainingGroupIds } } : undefined,
        ].filter((c): c is NonNullable<typeof c> => !!c),
      },
      include: SESSION_INCLUDE,
      orderBy: { date: 'desc' },
    });
  }

  async findOneSession(id: string) {
    const session = await this.getSessionOrThrow(id);
    const roster = await this.rosterFor(session);
    return { ...session, roster };
  }

  // A plain Coach must have a linked Coach profile (they're recorded as conducting the
  // session); Head Coach/Admin can create a session without one — see resolveOptionalCoachId.
  async createSession(user: RequestUser, dto: CreateTrainingSessionDto) {
    const academyId = this.tenantContext.getAcademyId();
    const coachId = this.coachContext.isCoachOnly(user)
      ? await this.coachContext.resolveCoachId(user.userId)
      : await this.coachContext.resolveOptionalCoachId(user.userId);
    const { date, ...rest } = dto;
    return this.prisma.trainingSession.create({
      data: { ...rest, academyId, date: new Date(date), conductedByCoachId: coachId ?? undefined, status: 'SCHEDULED' },
      include: SESSION_INCLUDE,
    });
  }

  async updateSession(id: string, user: RequestUser, dto: UpdateTrainingSessionDto) {
    const session = await this.assertOwnSession(id, user);
    const { date, ...rest } = dto;
    await this.prisma.trainingSession.update({
      where: { id, academyId: session.academyId },
      data: { ...rest, date: date ? new Date(date) : undefined },
    });
    return this.getSessionOrThrow(id);
  }

  // Rolls a date back to the most recent occurrence of the fixture's configured day of
  // week (today, if today already is that day).
  private resolveFixtureDate(dayOfWeek: number, dateStr?: string): Date {
    const base = dateStr ? new Date(dateStr) : new Date();
    const day = base.getUTCDay();
    const daysSince = (day - dayOfWeek + 7) % 7;
    return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() - daysSince));
  }

  private async getOrCreateWeeklySessionRecord(teamId: string, schedule: TrainingSchedule, dateStr?: string) {
    const academyId = this.tenantContext.getAcademyId();
    const date = this.resolveFixtureDate(schedule.dayOfWeek, dateStr);
    const existing = await this.prisma.trainingSession.findFirst({
      where: { teamId, date, academyId },
      include: SESSION_INCLUDE,
    });
    return (
      existing ??
      this.prisma.trainingSession.create({
        data: {
          academyId,
          teamId,
          date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          location: schedule.location ?? undefined,
          status: 'SCHEDULED',
        },
        include: SESSION_INCLUDE,
      })
    );
  }

  // Finds (or creates) this team's recurring weekly fixture session so staff never have to
  // manually schedule it — they just jump straight to marking attendance for it. Route/DTO
  // names kept as "Saturday" for API stability even though the day is now configurable.
  async getOrCreateSaturdaySession(teamId: string, dateStr?: string) {
    const schedule = await this.getSchedule();
    const session = await this.getOrCreateWeeklySessionRecord(teamId, schedule, dateStr);
    const roster = await this.rosterFor(session);
    return { ...session, roster };
  }

  // Runs daily at 06:00 UTC and, for each academy, provisions this week's fixture session
  // only on the day that academy has configured — ahead of kickoff so the session already
  // exists when players/staff show up, whichever day of the week that is.
  @Cron('0 6 * * *')
  async handleSaturdaySessionsCron() {
    const academies = await this.prisma.academy.findMany({ where: { status: 'ACTIVE' } });
    for (const academy of academies) {
      await this.tenantContext.run({ academyId: academy.id, slug: academy.slug }, async () => {
        const result = await this.provisionSaturdaySessions();
        this.logger.log(
          `Weekly training sessions cron (${academy.slug}): created ${result.created} session(s), skipped ${result.skipped} already existing.`,
        );
      });
    }
  }

  async provisionSaturdaySessions(): Promise<{ created: number; skipped: number }> {
    const academyId = this.tenantContext.getAcademyId();
    const schedule = await this.getSchedule();
    if (new Date().getUTCDay() !== schedule.dayOfWeek) {
      return { created: 0, skipped: 0 };
    }

    const teams = await this.prisma.team.findMany({ where: { academyId, isActive: true }, select: { id: true, name: true } });
    const date = this.resolveFixtureDate(schedule.dayOfWeek);
    let created = 0;
    let skipped = 0;

    for (const team of teams) {
      const existing = await this.prisma.trainingSession.findFirst({ where: { teamId: team.id, date, academyId } });
      if (existing) {
        skipped++;
        continue;
      }

      const session = await this.prisma.trainingSession.create({
        data: {
          academyId,
          teamId: team.id,
          date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          location: schedule.location ?? undefined,
          status: 'SCHEDULED',
        },
      });
      created++;
      await this.alertCoachesOfSaturdaySession(session, team.name);
    }

    return { created, skipped };
  }

  // Notifies every coach assigned to the team (directly, or via one of its training
  // groups) plus every Head Coach account-holder academy-wide — deduped by contact
  // info, since a Head Coach can also be a team's assigned coach. Best-effort: a failed
  // send must never roll back the session that was already created.
  private async alertCoachesOfSaturdaySession(
    session: { teamId: string; date: Date; startTime: string | null; endTime: string | null; location: string | null },
    teamName: string,
  ) {
    const academyId = this.tenantContext.getAcademyId();
    const [assignments, headCoachRoles] = await Promise.all([
      this.prisma.coachAssignment.findMany({
        where: {
          academyId,
          effectiveTo: null,
          coach: { isActive: true, deletedAt: null },
          OR: [{ teamId: session.teamId }, { trainingGroup: { teamId: session.teamId } }],
        },
        include: { coach: true },
      }),
      this.prisma.userRole.findMany({
        where: { role: { name: ROLE_NAMES.HEAD_COACH }, user: { academyId, status: 'ACTIVE', deletedAt: null } },
        include: { user: true },
      }),
    ]);

    const recipients = new Map<string, { email: string | null; phone: string | null }>();
    const addRecipient = (email: string | null | undefined, phone: string | null | undefined) => {
      const key = email?.toLowerCase() || phone || undefined;
      if (!key || recipients.has(key)) return;
      recipients.set(key, { email: email ?? null, phone: phone ?? null });
    };
    for (const assignment of assignments) {
      addRecipient(assignment.coach.email, assignment.coach.phone);
    }
    for (const userRole of headCoachRoles) {
      addRecipient(userRole.user.email, userRole.user.phone);
    }
    if (recipients.size === 0) return;

    const dateLabel = session.date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const dayName = session.date.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
    const timeLabel = `${session.startTime ?? DEFAULT_TRAINING_START_TIME}–${session.endTime ?? DEFAULT_TRAINING_END_TIME}`;
    const subject = `${dayName} training session created — ${teamName}`;
    const message = `A ${dayName} training session for ${teamName} has been scheduled for ${dateLabel}, ${timeLabel}${session.location ? ` at ${session.location}` : ''}.`;

    await Promise.all(
      Array.from(recipients.values()).map((recipient) =>
        Promise.all([
          recipient.email ? this.email.send({ to: recipient.email, subject, html: `<p>${message}</p>` }) : Promise.resolve(false),
          recipient.phone ? this.sms.send(recipient.phone, message) : Promise.resolve(false),
        ]),
      ),
    );
  }

  // Search-and-mark: staff find a player by name/ID and mark them present without ever
  // picking a team — the player's own team resolves (and auto-provisions) their Saturday
  // session behind the scenes.
  async quickMarkAttendance(playerId: string, user: RequestUser, status: AttendanceStatus = 'PRESENT') {
    const academyId = this.tenantContext.getAcademyId();
    const player = await this.prisma.player.findFirst({ where: { id: playerId, academyId } });
    if (!player || player.deletedAt) {
      throw new NotFoundException('Player not found');
    }
    if (player.status !== 'ACTIVE') {
      throw new BadRequestException('Only active players can be marked for training attendance');
    }
    if (!player.teamId) {
      throw new BadRequestException(`${player.firstName} ${player.lastName} is not assigned to a team yet`);
    }
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      await this.coachContext.assertOwnsPlayer(coachId, player);
    }

    const schedule = await this.getSchedule();
    const session = await this.getOrCreateWeeklySessionRecord(player.teamId, schedule);
    const recordedAt = new Date();

    return this.prisma.trainingAttendance.upsert({
      where: { trainingSessionId_playerId: { trainingSessionId: session.id, playerId } },
      create: { academyId, trainingSessionId: session.id, playerId, status, recordedByUserId: user.userId, recordedAt },
      update: { status, recordedByUserId: user.userId, recordedAt },
      include: {
        player: { select: { id: true, firstName: true, lastName: true, playerCode: true } },
        recordedByUser: { select: { id: true, firstName: true, lastName: true } },
        trainingSession: { include: { team: { select: { id: true, name: true } } } },
      },
    });
  }

  // Receptionist/Head Coach/Admin can record attendance on any session; a plain Coach is
  // restricted to sessions for their own assigned team/training group.
  async recordAttendance(id: string, user: RequestUser, dto: RecordAttendanceDto) {
    const session = await this.getSessionOrThrow(id);
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      await this.coachContext.assertOwnsSession(coachId, session);
    }
    const recordedAt = new Date();

    await this.prisma.$transaction(
      dto.records.map((record) =>
        this.prisma.trainingAttendance.upsert({
          where: { trainingSessionId_playerId: { trainingSessionId: id, playerId: record.playerId } },
          create: {
            academyId: session.academyId,
            trainingSessionId: id,
            playerId: record.playerId,
            status: record.status,
            remarks: record.remarks,
            recordedByUserId: user.userId,
            recordedAt,
          },
          update: { status: record.status, remarks: record.remarks, recordedByUserId: user.userId, recordedAt },
        }),
      ),
    );

    return this.getSessionOrThrow(id);
  }

  // Session activities are what players get rated against when a coach assesses them for
  // this specific session (see AssessmentsService#createAssessment) — a lighter-weight
  // alternative to picking a pre-built AssessmentTemplate. Scoped the same way attendance
  // recording is (team/group, not exact conductedByCoachId), since many sessions are
  // shared/auto-provisioned fixtures with no single owning coach.
  private async assertCanManageSession(sessionId: string, user: RequestUser) {
    const session = await this.getSessionOrThrow(sessionId);
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      await this.coachContext.assertOwnsSession(coachId, session);
    }
    return session;
  }

  async addSessionActivity(sessionId: string, user: RequestUser, dto: CreateSessionActivityDto) {
    const session = await this.assertCanManageSession(sessionId, user);
    const sortOrder = await this.prisma.trainingSessionActivity.count({ where: { trainingSessionId: sessionId } });
    await this.prisma.trainingSessionActivity.create({
      data: { academyId: session.academyId, trainingSessionId: sessionId, name: dto.name, sortOrder },
    });
    return this.findOneSession(sessionId);
  }

  async removeSessionActivity(sessionId: string, activityId: string, user: RequestUser) {
    const session = await this.assertCanManageSession(sessionId, user);

    const activity = await this.prisma.trainingSessionActivity.findFirst({
      where: { id: activityId, trainingSessionId: sessionId, academyId: session.academyId },
      include: { _count: { select: { ratings: true } } },
    });
    if (!activity) {
      throw new NotFoundException('Session activity not found');
    }
    if (activity._count.ratings > 0) {
      throw new ConflictException('Cannot remove an activity that already has assessment ratings recorded against it');
    }

    await this.prisma.trainingSessionActivity.delete({ where: { id: activityId } });
    return this.findOneSession(sessionId);
  }
}
