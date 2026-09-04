"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TrainingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const coach_context_service_1 = require("../coaches/coach-context.service");
const email_service_1 = require("../messaging/email.service");
const sms_service_1 = require("../messaging/sms.service");
const permissions_constants_1 = require("../rbac/permissions.constants");
const EDITABLE_STATUSES = ['DRAFT', 'CHANGES_REQUESTED'];
const PLAN_INCLUDE = {
    activities: { orderBy: { sortOrder: 'asc' } },
    approvals: { orderBy: { submittedAt: 'desc' } },
    coach: true,
    team: true,
    trainingGroup: true,
};
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
    sessionActivities: { orderBy: { sortOrder: 'asc' } },
};
const SATURDAY_START_TIME = '08:00';
const SATURDAY_END_TIME = '10:00';
let TrainingService = TrainingService_1 = class TrainingService {
    constructor(prisma, coachContext, email, sms) {
        this.prisma = prisma;
        this.coachContext = coachContext;
        this.email = email;
        this.sms = sms;
        this.logger = new common_1.Logger(TrainingService_1.name);
    }
    canApprove(user) {
        return user.permissions.includes(permissions_constants_1.PERMISSIONS.TRAINING_APPROVE);
    }
    async listTeamsForPicker(user) {
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
    async getPlanOrThrow(id) {
        const plan = await this.prisma.trainingPlan.findUnique({ where: { id }, include: PLAN_INCLUDE });
        if (!plan) {
            throw new common_1.NotFoundException('Training plan not found');
        }
        return plan;
    }
    assertEditable(approvalStatus) {
        if (!EDITABLE_STATUSES.includes(approvalStatus)) {
            throw new common_1.BadRequestException(`Cannot edit a training plan in status ${approvalStatus}`);
        }
    }
    async findAllPlans(user, status) {
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
    async findOnePlan(id, user) {
        const plan = await this.getPlanOrThrow(id);
        if (!this.canApprove(user)) {
            const coachId = await this.coachContext.resolveCoachId(user.userId);
            if (plan.coachId !== coachId) {
                throw new common_1.ForbiddenException('You do not have access to this training plan');
            }
        }
        return plan;
    }
    async createPlan(userId, dto) {
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
    async assertOwnPlan(id, userId) {
        const coachId = await this.coachContext.resolveCoachId(userId);
        const plan = await this.getPlanOrThrow(id);
        if (plan.coachId !== coachId) {
            throw new common_1.ForbiddenException('You do not have access to this training plan');
        }
        return plan;
    }
    async updatePlan(id, userId, dto) {
        const plan = await this.assertOwnPlan(id, userId);
        this.assertEditable(plan.approvalStatus);
        const { scheduledDate, ...rest } = dto;
        await this.prisma.trainingPlan.update({
            where: { id },
            data: { ...rest, scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined },
        });
        return this.getPlanOrThrow(id);
    }
    async addActivity(planId, userId, dto) {
        const plan = await this.assertOwnPlan(planId, userId);
        this.assertEditable(plan.approvalStatus);
        await this.prisma.trainingActivity.create({ data: { ...dto, trainingPlanId: planId } });
        return this.getPlanOrThrow(planId);
    }
    async updateActivity(planId, activityId, userId, dto) {
        const plan = await this.assertOwnPlan(planId, userId);
        this.assertEditable(plan.approvalStatus);
        const activity = await this.prisma.trainingActivity.findFirst({
            where: { id: activityId, trainingPlanId: planId },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Training activity not found');
        }
        await this.prisma.trainingActivity.update({ where: { id: activityId }, data: dto });
        return this.getPlanOrThrow(planId);
    }
    async removeActivity(planId, activityId, userId) {
        const plan = await this.assertOwnPlan(planId, userId);
        this.assertEditable(plan.approvalStatus);
        const activity = await this.prisma.trainingActivity.findFirst({
            where: { id: activityId, trainingPlanId: planId },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Training activity not found');
        }
        await this.prisma.trainingActivity.delete({ where: { id: activityId } });
        return this.getPlanOrThrow(planId);
    }
    async getActivityOrThrow(activityId) {
        const activity = await this.prisma.trainingActivity.findUnique({
            where: { id: activityId },
            include: { trainingPlan: true },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Training activity not found');
        }
        return activity;
    }
    async assertMarksAccess(user, plan) {
        if (!this.coachContext.isCoachOnly(user))
            return;
        const coachId = await this.coachContext.resolveCoachId(user.userId);
        await this.coachContext.assertOwnsPlan(coachId, plan);
    }
    async getActivityMarks(activityId, user) {
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
    async upsertActivityMarks(activityId, user, dto) {
        const activity = await this.getActivityOrThrow(activityId);
        await this.assertMarksAccess(user, activity.trainingPlan);
        const ratedByCoachId = await this.coachContext.resolveCoachId(user.userId);
        await this.prisma.$transaction(dto.records.map((record) => this.prisma.trainingActivityMark.upsert({
            where: { trainingActivityId_playerId: { trainingActivityId: activityId, playerId: record.playerId } },
            create: {
                trainingActivityId: activityId,
                playerId: record.playerId,
                ratedByCoachId,
                rating: record.rating,
                remarks: record.remarks,
            },
            update: { rating: record.rating, remarks: record.remarks, ratedByCoachId },
        })));
        return this.getActivityMarks(activityId, user);
    }
    async getPlayerMarks(playerId, user) {
        if (this.coachContext.isCoachOnly(user)) {
            const coachId = await this.coachContext.resolveCoachId(user.userId);
            const player = await this.prisma.player.findUnique({
                where: { id: playerId },
                select: { teamId: true, trainingGroupId: true },
            });
            if (!player) {
                throw new common_1.NotFoundException('Player not found');
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
    async getTeamMarks(teamId, user) {
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
    async submit(id, userId) {
        const plan = await this.assertOwnPlan(id, userId);
        if (!EDITABLE_STATUSES.includes(plan.approvalStatus)) {
            throw new common_1.BadRequestException(`Cannot submit a training plan in status ${plan.approvalStatus}`);
        }
        await this.prisma.$transaction([
            this.prisma.trainingPlan.update({ where: { id }, data: { approvalStatus: 'SUBMITTED' } }),
            this.prisma.trainingApproval.create({ data: { trainingPlanId: id, submittedByUserId: userId } }),
        ]);
        return this.getPlanOrThrow(id);
    }
    async decide(id, reviewerUserId, dto) {
        const plan = await this.getPlanOrThrow(id);
        if (plan.approvalStatus !== 'SUBMITTED') {
            throw new common_1.BadRequestException(`Cannot record a decision for a plan in status ${plan.approvalStatus}`);
        }
        const pendingApproval = await this.prisma.trainingApproval.findFirst({
            where: { trainingPlanId: id, decision: 'SUBMITTED' },
            orderBy: { submittedAt: 'desc' },
        });
        if (!pendingApproval) {
            throw new common_1.NotFoundException('No pending approval found for this plan');
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
    async getSessionOrThrow(id) {
        const session = await this.prisma.trainingSession.findUnique({ where: { id }, include: SESSION_INCLUDE });
        if (!session) {
            throw new common_1.NotFoundException('Training session not found');
        }
        return session;
    }
    async assertOwnSession(id, userId) {
        const coachId = await this.coachContext.resolveCoachId(userId);
        const session = await this.getSessionOrThrow(id);
        if (session.conductedByCoachId !== coachId) {
            throw new common_1.ForbiddenException('You do not have access to this training session');
        }
        return session;
    }
    async rosterFor(session) {
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
    async ensureTodaysSaturdaySessions(teamIds) {
        if (new Date().getUTCDay() !== 6 || teamIds.length === 0) {
            return;
        }
        await Promise.all(teamIds.map((teamId) => this.getOrCreateSaturdaySessionRecord(teamId)));
    }
    async findAllSessions(user) {
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
                ].filter((c) => !!c),
            },
            include: SESSION_INCLUDE,
            orderBy: { date: 'desc' },
        });
    }
    async findOneSession(id) {
        const session = await this.getSessionOrThrow(id);
        const roster = await this.rosterFor(session);
        return { ...session, roster };
    }
    async createSession(userId, dto) {
        const coachId = await this.coachContext.resolveCoachId(userId);
        const { date, ...rest } = dto;
        return this.prisma.trainingSession.create({
            data: { ...rest, date: new Date(date), conductedByCoachId: coachId, status: 'SCHEDULED' },
            include: SESSION_INCLUDE,
        });
    }
    async updateSession(id, userId, dto) {
        await this.assertOwnSession(id, userId);
        const { date, ...rest } = dto;
        await this.prisma.trainingSession.update({
            where: { id },
            data: { ...rest, date: date ? new Date(date) : undefined },
        });
        return this.getSessionOrThrow(id);
    }
    resolveSaturday(dateStr) {
        const base = dateStr ? new Date(dateStr) : new Date();
        const day = base.getUTCDay();
        const daysSinceSaturday = (day + 1) % 7;
        return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() - daysSinceSaturday));
    }
    async getOrCreateSaturdaySessionRecord(teamId, dateStr) {
        const date = this.resolveSaturday(dateStr);
        const existing = await this.prisma.trainingSession.findFirst({ where: { teamId, date }, include: SESSION_INCLUDE });
        return (existing ??
            this.prisma.trainingSession.create({
                data: { teamId, date, startTime: SATURDAY_START_TIME, endTime: SATURDAY_END_TIME, status: 'SCHEDULED' },
                include: SESSION_INCLUDE,
            }));
    }
    async getOrCreateSaturdaySession(teamId, dateStr) {
        const session = await this.getOrCreateSaturdaySessionRecord(teamId, dateStr);
        const roster = await this.rosterFor(session);
        return { ...session, roster };
    }
    async handleSaturdaySessionsCron() {
        const result = await this.provisionSaturdaySessions();
        this.logger.log(`Saturday sessions cron: created ${result.created} session(s), skipped ${result.skipped} already existing.`);
    }
    async provisionSaturdaySessions() {
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
    async alertCoachesOfSaturdaySession(session, teamName) {
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
                where: { role: { name: permissions_constants_1.ROLE_NAMES.HEAD_COACH }, user: { status: 'ACTIVE', deletedAt: null } },
                include: { user: true },
            }),
        ]);
        const recipients = new Map();
        const addRecipient = (email, phone) => {
            const key = email?.toLowerCase() || phone || undefined;
            if (!key || recipients.has(key))
                return;
            recipients.set(key, { email: email ?? null, phone: phone ?? null });
        };
        for (const assignment of assignments) {
            addRecipient(assignment.coach.email, assignment.coach.phone);
        }
        for (const userRole of headCoachRoles) {
            addRecipient(userRole.user.email, userRole.user.phone);
        }
        if (recipients.size === 0)
            return;
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
        await Promise.all(Array.from(recipients.values()).map((recipient) => Promise.all([
            recipient.email ? this.email.send({ to: recipient.email, subject, html: `<p>${message}</p>` }) : Promise.resolve(false),
            recipient.phone ? this.sms.send(recipient.phone, message) : Promise.resolve(false),
        ])));
    }
    async quickMarkAttendance(playerId, user, status = 'PRESENT') {
        const player = await this.prisma.player.findUnique({ where: { id: playerId } });
        if (!player || player.deletedAt) {
            throw new common_1.NotFoundException('Player not found');
        }
        if (player.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Only active players can be marked for training attendance');
        }
        if (!player.teamId) {
            throw new common_1.BadRequestException(`${player.firstName} ${player.lastName} is not assigned to a team yet`);
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
    async recordAttendance(id, user, dto) {
        const session = await this.getSessionOrThrow(id);
        if (this.coachContext.isCoachOnly(user)) {
            const coachId = await this.coachContext.resolveCoachId(user.userId);
            await this.coachContext.assertOwnsSession(coachId, session);
        }
        const recordedAt = new Date();
        await this.prisma.$transaction(dto.records.map((record) => this.prisma.trainingAttendance.upsert({
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
        })));
        return this.getSessionOrThrow(id);
    }
    async assertCanManageSession(sessionId, user) {
        const session = await this.getSessionOrThrow(sessionId);
        if (this.coachContext.isCoachOnly(user)) {
            const coachId = await this.coachContext.resolveCoachId(user.userId);
            await this.coachContext.assertOwnsSession(coachId, session);
        }
        return session;
    }
    async addSessionActivity(sessionId, user, dto) {
        await this.assertCanManageSession(sessionId, user);
        const sortOrder = await this.prisma.trainingSessionActivity.count({ where: { trainingSessionId: sessionId } });
        await this.prisma.trainingSessionActivity.create({
            data: { trainingSessionId: sessionId, name: dto.name, sortOrder },
        });
        return this.findOneSession(sessionId);
    }
    async removeSessionActivity(sessionId, activityId, user) {
        await this.assertCanManageSession(sessionId, user);
        const activity = await this.prisma.trainingSessionActivity.findFirst({
            where: { id: activityId, trainingSessionId: sessionId },
            include: { _count: { select: { ratings: true } } },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Session activity not found');
        }
        if (activity._count.ratings > 0) {
            throw new common_1.ConflictException('Cannot remove an activity that already has assessment ratings recorded against it');
        }
        await this.prisma.trainingSessionActivity.delete({ where: { id: activityId } });
        return this.findOneSession(sessionId);
    }
};
exports.TrainingService = TrainingService;
__decorate([
    (0, schedule_1.Cron)('0 6 * * 6'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrainingService.prototype, "handleSaturdaySessionsCron", null);
exports.TrainingService = TrainingService = TrainingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        coach_context_service_1.CoachContextService,
        email_service_1.EmailService,
        sms_service_1.SmsService])
], TrainingService);
//# sourceMappingURL=training.service.js.map