import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AttendanceStatus, Prisma, TrainingApprovalStatus } from '@prisma/client';
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

// Training is a fixed academy-wide fixture — every Saturday, 08:00-10:00 — so sessions
// are auto-provisioned per team rather than manually scheduled.
const SATURDAY_START_TIME = '08:00';
const SATURDAY_END_TIME = '10:00';

@Injectable()
export class TrainingService {
  private readonly logger = new Logger(TrainingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coachContext: CoachContextService,
    private readonly email: EmailService,
    private readonly sms: SmsService,
  ) {}

  private canApprove(user: RequestUser): boolean {
    return user.permissions.includes(PERMISSIONS.TRAINING_APPROVE);
  }

  // Coaches don't hold ACADEMY_CONFIG_VIEW, so this is their only way to see which teams
  // exist when picking one for a new plan/session/match. Scoped to the coach's own assigned
  // team(s) so the picker defaults to what they actually manage; falls back to every active
  // team if they have none assigned yet, so they're never stuck with an empty picker.
  async listTeamsForPicker(user: RequestUser) {
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      const teamIds = await this.coachContext.getAssignedTeamIds(coachId);
      if (teamIds.length > 0) {
        return this.prisma.team.findMany({
          where: { isActive: true, id: { in: teamIds } },
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        });
      }
    }

    return this.prisma.team.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  private async getPlanOrThrow(id: string) {
    const plan = await this.prisma.trainingPlan.findUnique({ where: { id }, include: PLAN_INCLUDE });
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
    if (this.canApprove(user)) {
      return this.prisma.trainingPlan.findMany({
        where: { approvalStatus: status },
        include: PLAN_INCLUDE,
        orderBy: { scheduledDate: 'desc' },
      });
    }

    const coachId = await this.coachContext.resolveCoachId(user.userId);
    return this.prisma.trainingPlan.findMany({
      where: { coachId, approvalStatus: status },
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
    const coachId = await this.coachContext.resolveCoachId(userId);
    const { activities, scheduledDate, ...rest } = dto;

    const plan = await this.prisma.trainingPlan.create({
      data: {
        ...rest,
        scheduledDate: new Date(scheduledDate),
        coachId,
        approvalStatus: 'DRAFT',
        activities: activities?.length ? { create: activities } : undefined,
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
      where: { id },
      data: { ...rest, scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined },
    });
    return this.getPlanOrThrow(id);
  }

  async addActivity(planId: string, userId: string, dto: CreateTrainingActivityInputDto) {
    const plan = await this.assertOwnPlan(planId, userId);
    this.assertEditable(plan.approvalStatus);

    await this.prisma.trainingActivity.create({ data: { ...dto, trainingPlanId: planId } });
    return this.getPlanOrThrow(planId);
  }

  async updateActivity(planId: string, activityId: string, userId: string, dto: UpdateTrainingActivityDto) {
    const plan = await this.assertOwnPlan(planId, userId);
    this.assertEditable(plan.approvalStatus);

    const activity = await this.prisma.trainingActivity.findFirst({
      where: { id: activityId, trainingPlanId: planId },
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
      where: { id: activityId, trainingPlanId: planId },
    });
    if (!activity) {
      throw new NotFoundException('Training activity not found');
    }

    await this.prisma.trainingActivity.delete({ where: { id: activityId } });
    return this.getPlanOrThrow(planId);
  }

  // --- Activity Marks ---
  private async getActivityOrThrow(activityId: string) {
    const activity = await this.prisma.trainingActivity.findUnique({
      where: { id: activityId },
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
    const activity = await this.getActivityOrThrow(activityId);
    await this.assertMarksAccess(user, activity.trainingPlan);

    const [roster, marks] = await Promise.all([
      this.rosterFor(activity.trainingPlan),
      this.prisma.trainingActivityMark.findMany({
        where: { trainingActivityId: activityId },
        include: { ratedByCoach: { select: { id: true, firstName: true, lastName: true } } },
      }),
    ]);

    return { activity, roster, marks };
  }

  async upsertActivityMarks(activityId: string, user: RequestUser, dto: UpsertActivityMarksDto) {
    const activity = await this.getActivityOrThrow(activityId);
    await this.assertMarksAccess(user, activity.trainingPlan);
    const ratedByCoachId = await this.coachContext.resolveCoachId(user.userId);

    await this.prisma.$transaction(
      dto.records.map((record) =>
        this.prisma.trainingActivityMark.upsert({
          where: { trainingActivityId_playerId: { trainingActivityId: activityId, playerId: record.playerId } },
          create: {
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
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      const player = await this.prisma.player.findUnique({
        where: { id: playerId },
        select: { teamId: true, trainingGroupId: true },
      });
      if (!player) {
        throw new NotFoundException('Player not found');
      }
      await this.coachContext.assertOwnsPlayer(coachId, player);
    }

    return this.prisma.trainingActivityMark.findMany({
      where: { playerId },
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
    if (this.coachContext.isCoachOnly(user)) {
      const coachId = await this.coachContext.resolveCoachId(user.userId);
      await this.coachContext.assertOwnsTeam(coachId, teamId);
    }

    return this.prisma.trainingActivityMark.findMany({
      where: { player: { teamId } },
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
      this.prisma.trainingPlan.update({ where: { id }, data: { approvalStatus: 'SUBMITTED' } }),
      this.prisma.trainingApproval.create({ data: { trainingPlanId: id, submittedByUserId: userId } }),
    ]);
    return this.getPlanOrThrow(id);
  }

  async decide(id: string, reviewerUserId: string, dto: TrainingPlanDecisionDto) {
    const plan = await this.getPlanOrThrow(id);
    if (plan.approvalStatus !== 'SUBMITTED') {
      throw new BadRequestException(`Cannot record a decision for a plan in status ${plan.approvalStatus}`);
    }

    const pendingApproval = await this.prisma.trainingApproval.findFirst({
      where: { trainingPlanId: id, decision: 'SUBMITTED' },
      orderBy: { submittedAt: 'desc' },
    });
    if (!pendingApproval) {
      throw new NotFoundException('No pending approval found for this plan');
    }

    await this.prisma.$transaction([
      this.prisma.trainingPlan.update({ where: { id }, data: { approvalStatus: dto.decision } }),
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
    const session = await this.prisma.trainingSession.findUnique({ where: { id }, include: SESSION_INCLUDE });
    if (!session) {
      throw new NotFoundException('Training session not found');
    }
    return session;
  }

  private async assertOwnSession(id: string, userId: string) {
    const coachId = await this.coachContext.resolveCoachId(userId);
    const session = await this.getSessionOrThrow(id);
    if (session.conductedByCoachId !== coachId) {
      throw new ForbiddenException('You do not have access to this training session');
    }
    return session;
  }

  private async rosterFor(session: { teamId: string; trainingGroupId: string | null }) {
    return this.prisma.player.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
        teamId: session.teamId,
        trainingGroupId: session.trainingGroupId ?? undefined,
      },
      select: { id: true, firstName: true, lastName: true, playerCode: true, photoDocumentId: true },
      orderBy: { lastName: 'asc' },
    });
  }

  // Every Saturday is a training day academy-wide — rather than wait for someone to hit
  // quick-mark-attendance or the /sessions/saturday endpoint for a given team, materialize
  // today's session for every relevant team up front so it already shows up in "my sessions"
  // (coach dashboard, sessions list) the first time anyone looks, with nothing to schedule.
  private async ensureTodaysSaturdaySessions(teamIds: string[]) {
    if (new Date().getUTCDay() !== 6 /* Saturday */ || teamIds.length === 0) {
      return;
    }
    await Promise.all(teamIds.map((teamId) => this.getOrCreateSaturdaySessionRecord(teamId)));
  }

  // Training is a shared academy-wide fixture (every Saturday), so Receptionist/Head Coach/
  // Admin see every session — but a plain Coach is scoped to only their own team(s)/group(s).
  async findAllSessions(user: RequestUser) {
    if (!this.coachContext.isCoachOnly(user)) {
      const allTeamIds = await this.prisma.team.findMany({ where: { isActive: true }, select: { id: true } });
      await this.ensureTodaysSaturdaySessions(allTeamIds.map((t) => t.id));
      return this.prisma.trainingSession.findMany({ include: SESSION_INCLUDE, orderBy: { date: 'desc' } });
    }

    const coachId = await this.coachContext.resolveCoachId(user.userId);
    const [teamIds, trainingGroupIds] = await Promise.all([
      this.coachContext.getAssignedTeamIds(coachId),
      this.coachContext.getAssignedTrainingGroupIds(coachId),
    ]);
    if (teamIds.length === 0 && trainingGroupIds.length === 0) {
      return [];
    }
    await this.ensureTodaysSaturdaySessions(teamIds);

    return this.prisma.trainingSession.findMany({
      where: {
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

  async createSession(userId: string, dto: CreateTrainingSessionDto) {
    const coachId = await this.coachContext.resolveCoachId(userId);
    const { date, ...rest } = dto;
    return this.prisma.trainingSession.create({
      data: { ...rest, date: new Date(date), conductedByCoachId: coachId, status: 'SCHEDULED' },
      include: SESSION_INCLUDE,
    });
  }

  async updateSession(id: string, userId: string, dto: UpdateTrainingSessionDto) {
    await this.assertOwnSession(id, userId);
    const { date, ...rest } = dto;
    await this.prisma.trainingSession.update({
      where: { id },
      data: { ...rest, date: date ? new Date(date) : undefined },
    });
    return this.getSessionOrThrow(id);
  }

  // Rolls a date back to the Saturday of its week (today, if it's already Saturday).
  private resolveSaturday(dateStr?: string): Date {
    const base = dateStr ? new Date(dateStr) : new Date();
    const day = base.getUTCDay(); // 0 = Sunday .. 6 = Saturday
    const daysSinceSaturday = (day + 1) % 7;
    return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() - daysSinceSaturday));
  }

  private async getOrCreateSaturdaySessionRecord(teamId: string, dateStr?: string) {
    const date = this.resolveSaturday(dateStr);
    const existing = await this.prisma.trainingSession.findFirst({ where: { teamId, date }, include: SESSION_INCLUDE });
    return (
      existing ??
      this.prisma.trainingSession.create({
        data: { teamId, date, startTime: SATURDAY_START_TIME, endTime: SATURDAY_END_TIME, status: 'SCHEDULED' },
        include: SESSION_INCLUDE,
      })
    );
  }

  // Finds (or creates) this team's fixed Saturday 08:00-10:00 session so staff never have
  // to manually schedule the recurring weekly fixture — they just jump straight to marking
  // attendance for it.
  async getOrCreateSaturdaySession(teamId: string, dateStr?: string) {
    const session = await this.getOrCreateSaturdaySessionRecord(teamId, dateStr);
    const roster = await this.rosterFor(session);
    return { ...session, roster };
  }

  // Runs every Saturday at 06:00 — ahead of the 08:00 kickoff — so this week's session
  // exists for every active team up front instead of waiting for the lazy get-or-create
  // paths above to fire whenever someone happens to open the app.
  @Cron('0 6 * * 6')
  async handleSaturdaySessionsCron() {
    const result = await this.provisionSaturdaySessions();
    this.logger.log(
      `Saturday sessions cron: created ${result.created} session(s), skipped ${result.skipped} already existing.`,
    );
  }

  async provisionSaturdaySessions(): Promise<{ created: number; skipped: number }> {
    const teams = await this.prisma.team.findMany({ where: { isActive: true }, select: { id: true, name: true } });
    const date = this.resolveSaturday();
    let created = 0;
    let skipped = 0;

    for (const team of teams) {
      const existing = await this.prisma.trainingSession.findFirst({ where: { teamId: team.id, date } });
      if (existing) {
        skipped++;
        continue;
      }

      const session = await this.prisma.trainingSession.create({
        data: { teamId: team.id, date, startTime: SATURDAY_START_TIME, endTime: SATURDAY_END_TIME, status: 'SCHEDULED' },
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
    const [assignments, headCoachRoles] = await Promise.all([
      this.prisma.coachAssignment.findMany({
        where: {
          effectiveTo: null,
          coach: { isActive: true, deletedAt: null },
          OR: [{ teamId: session.teamId }, { trainingGroup: { teamId: session.teamId } }],
        },
        include: { coach: true },
      }),
      this.prisma.userRole.findMany({
        where: { role: { name: ROLE_NAMES.HEAD_COACH }, user: { status: 'ACTIVE', deletedAt: null } },
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
    const timeLabel = `${session.startTime ?? SATURDAY_START_TIME}–${session.endTime ?? SATURDAY_END_TIME}`;
    const subject = `Saturday training session created — ${teamName}`;
    const message = `A Saturday training session for ${teamName} has been scheduled for ${dateLabel}, ${timeLabel}${session.location ? ` at ${session.location}` : ''}.`;

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
    const player = await this.prisma.player.findUnique({ where: { id: playerId } });
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

    const session = await this.getOrCreateSaturdaySessionRecord(player.teamId);
    const recordedAt = new Date();

    return this.prisma.trainingAttendance.upsert({
      where: { trainingSessionId_playerId: { trainingSessionId: session.id, playerId } },
      create: { trainingSessionId: session.id, playerId, status, recordedByUserId: user.userId, recordedAt },
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
    await this.assertCanManageSession(sessionId, user);
    const sortOrder = await this.prisma.trainingSessionActivity.count({ where: { trainingSessionId: sessionId } });
    await this.prisma.trainingSessionActivity.create({
      data: { trainingSessionId: sessionId, name: dto.name, sortOrder },
    });
    return this.findOneSession(sessionId);
  }

  async removeSessionActivity(sessionId: string, activityId: string, user: RequestUser) {
    await this.assertCanManageSession(sessionId, user);

    const activity = await this.prisma.trainingSessionActivity.findFirst({
      where: { id: activityId, trainingSessionId: sessionId },
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
