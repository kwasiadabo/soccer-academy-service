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
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
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
const DEFAULT_TRAINING_START_TIME = '08:00';
const DEFAULT_TRAINING_END_TIME = '10:00';
let TrainingService = TrainingService_1 = class TrainingService {
    constructor(prisma, coachContext, email, sms, tenantContext) {
        this.prisma = prisma;
        this.coachContext = coachContext;
        this.email = email;
        this.sms = sms;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(TrainingService_1.name);
    }
    canApprove(user) {
        return user.permissions.includes(permissions_constants_1.PERMISSIONS.TRAINING_APPROVE);
    }
    async listTeamsForPicker(user) {
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
    async getPlanOrThrow(id) {
        const academyId = this.tenantContext.getAcademyId();
        const plan = await this.prisma.trainingPlan.findFirst({ where: { id, academyId }, include: PLAN_INCLUDE });
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
            where: { id, academyId: plan.academyId },
            data: { ...rest, scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined },
        });
        return this.getPlanOrThrow(id);
    }
    async addActivity(planId, userId, dto) {
        const plan = await this.assertOwnPlan(planId, userId);
        this.assertEditable(plan.approvalStatus);
        await this.prisma.trainingActivity.create({
            data: { ...dto, trainingPlanId: planId, academyId: plan.academyId },
        });
        return this.getPlanOrThrow(planId);
    }
    async updateActivity(planId, activityId, userId, dto) {
        const plan = await this.assertOwnPlan(planId, userId);
        this.assertEditable(plan.approvalStatus);
        const activity = await this.prisma.trainingActivity.findFirst({
            where: { id: activityId, trainingPlanId: planId, academyId: plan.academyId },
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
            where: { id: activityId, trainingPlanId: planId, academyId: plan.academyId },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Training activity not found');
        }
        await this.prisma.trainingActivity.delete({ where: { id: activityId } });
        return this.getPlanOrThrow(planId);
    }
    async getActivityOrThrow(activityId) {
        const academyId = this.tenantContext.getAcademyId();
        const activity = await this.prisma.trainingActivity.findFirst({
            where: { id: activityId, academyId },
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
    async upsertActivityMarks(activityId, user, dto) {
        const academyId = this.tenantContext.getAcademyId();
        const activity = await this.getActivityOrThrow(activityId);
        await this.assertMarksAccess(user, activity.trainingPlan);
        const ratedByCoachId = await this.coachContext.resolveCoachId(user.userId);
        await this.prisma.$transaction(dto.records.map((record) => this.prisma.trainingActivityMark.upsert({
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
        })));
        return this.getActivityMarks(activityId, user);
    }
    async getPlayerMarks(playerId, user) {
        const academyId = this.tenantContext.getAcademyId();
        if (this.coachContext.isCoachOnly(user)) {
            const coachId = await this.coachContext.resolveCoachId(user.userId);
            const player = await this.prisma.player.findFirst({
                where: { id: playerId, academyId },
                select: { teamId: true, trainingGroupId: true },
            });
            if (!player) {
                throw new common_1.NotFoundException('Player not found');
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
    async getTeamMarks(teamId, user) {
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
    async submit(id, userId) {
        const plan = await this.assertOwnPlan(id, userId);
        if (!EDITABLE_STATUSES.includes(plan.approvalStatus)) {
            throw new common_1.BadRequestException(`Cannot submit a training plan in status ${plan.approvalStatus}`);
        }
        await this.prisma.$transaction([
            this.prisma.trainingPlan.update({ where: { id, academyId: plan.academyId }, data: { approvalStatus: 'SUBMITTED' } }),
            this.prisma.trainingApproval.create({
                data: { academyId: plan.academyId, trainingPlanId: id, submittedByUserId: userId },
            }),
        ]);
        return this.getPlanOrThrow(id);
    }
    async decide(id, reviewerUserId, dto) {
        const plan = await this.getPlanOrThrow(id);
        if (plan.approvalStatus !== 'SUBMITTED') {
            throw new common_1.BadRequestException(`Cannot record a decision for a plan in status ${plan.approvalStatus}`);
        }
        const pendingApproval = await this.prisma.trainingApproval.findFirst({
            where: { trainingPlanId: id, decision: 'SUBMITTED', academyId: plan.academyId },
            orderBy: { submittedAt: 'desc' },
        });
        if (!pendingApproval) {
            throw new common_1.NotFoundException('No pending approval found for this plan');
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
    async getSessionOrThrow(id) {
        const academyId = this.tenantContext.getAcademyId();
        const session = await this.prisma.trainingSession.findFirst({ where: { id, academyId }, include: SESSION_INCLUDE });
        if (!session) {
            throw new common_1.NotFoundException('Training session not found');
        }
        return session;
    }
    async assertOwnSession(id, user) {
        const session = await this.getSessionOrThrow(id);
        if (this.coachContext.isCoachOnly(user)) {
            const coachId = await this.coachContext.resolveCoachId(user.userId);
            if (session.conductedByCoachId !== coachId) {
                throw new common_1.ForbiddenException('You do not have access to this training session');
            }
        }
        return session;
    }
    async rosterFor(session) {
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
    async listSchedule() {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.trainingScheduleSlot.findMany({
            where: { academyId },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
    }
    async addScheduleSlot(dto) {
        if (dto.startTime >= dto.endTime) {
            throw new common_1.BadRequestException('Start time must be before end time');
        }
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.trainingScheduleSlot.create({
            data: {
                academyId,
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                endTime: dto.endTime,
                location: dto.location,
            },
        });
    }
    async updateScheduleSlot(id, dto) {
        const academyId = this.tenantContext.getAcademyId();
        const existing = await this.prisma.trainingScheduleSlot.findFirst({ where: { id, academyId } });
        if (!existing) {
            throw new common_1.NotFoundException('Training schedule slot not found');
        }
        const startTime = dto.startTime ?? existing.startTime;
        const endTime = dto.endTime ?? existing.endTime;
        if (startTime >= endTime) {
            throw new common_1.BadRequestException('Start time must be before end time');
        }
        return this.prisma.trainingScheduleSlot.update({
            where: { id, academyId },
            data: {
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                endTime: dto.endTime,
                location: dto.location,
            },
        });
    }
    async removeScheduleSlot(id) {
        const academyId = this.tenantContext.getAcademyId();
        const existing = await this.prisma.trainingScheduleSlot.findFirst({ where: { id, academyId } });
        if (!existing) {
            throw new common_1.NotFoundException('Training schedule slot not found');
        }
        await this.prisma.trainingScheduleSlot.delete({ where: { id, academyId } });
    }
    pickRelevantSlot(slots, dateStr) {
        if (slots.length === 0) {
            throw new common_1.BadRequestException('No weekly training schedule is configured for this academy yet');
        }
        const referenceDay = (dateStr ? new Date(dateStr) : new Date()).getUTCDay();
        const exactMatch = slots.find((s) => s.dayOfWeek === referenceDay);
        if (exactMatch)
            return exactMatch;
        let best = slots[0];
        let bestDate = this.resolveFixtureDate(best.dayOfWeek, dateStr);
        for (const slot of slots.slice(1)) {
            const candidateDate = this.resolveFixtureDate(slot.dayOfWeek, dateStr);
            if (candidateDate.getTime() > bestDate.getTime()) {
                best = slot;
                bestDate = candidateDate;
            }
        }
        return best;
    }
    async ensureThisWeeksWeeklySessions(teamIds, slots) {
        if (teamIds.length === 0 || slots.length === 0) {
            return;
        }
        await Promise.all(teamIds.flatMap((teamId) => slots.map((slot) => this.getOrCreateWeeklySessionRecord(teamId, slot))));
    }
    async findAllSessions(user) {
        const academyId = this.tenantContext.getAcademyId();
        const slots = await this.listSchedule();
        if (!this.coachContext.isCoachOnly(user)) {
            const allTeamIds = await this.prisma.team.findMany({ where: { academyId, isActive: true }, select: { id: true } });
            await this.ensureThisWeeksWeeklySessions(allTeamIds.map((t) => t.id), slots);
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
        await this.ensureThisWeeksWeeklySessions(teamIds, slots);
        return this.prisma.trainingSession.findMany({
            where: {
                academyId,
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
    async createSession(user, dto) {
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
    async updateSession(id, user, dto) {
        const session = await this.assertOwnSession(id, user);
        const { date, ...rest } = dto;
        await this.prisma.trainingSession.update({
            where: { id, academyId: session.academyId },
            data: { ...rest, date: date ? new Date(date) : undefined },
        });
        return this.getSessionOrThrow(id);
    }
    resolveFixtureDate(dayOfWeek, dateStr) {
        const base = dateStr ? new Date(dateStr) : new Date();
        const day = base.getUTCDay();
        const daysSince = (day - dayOfWeek + 7) % 7;
        return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() - daysSince));
    }
    async getOrCreateWeeklySessionRecord(teamId, slot, dateStr) {
        const academyId = this.tenantContext.getAcademyId();
        const date = this.resolveFixtureDate(slot.dayOfWeek, dateStr);
        const existing = await this.prisma.trainingSession.findFirst({
            where: { teamId, date, startTime: slot.startTime, academyId },
            include: SESSION_INCLUDE,
        });
        return (existing ??
            this.prisma.trainingSession.create({
                data: {
                    academyId,
                    teamId,
                    date,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    location: slot.location ?? undefined,
                    status: 'SCHEDULED',
                },
                include: SESSION_INCLUDE,
            }));
    }
    async getOrCreateSaturdaySession(teamId, dateStr) {
        const slots = await this.listSchedule();
        const slot = this.pickRelevantSlot(slots, dateStr);
        const session = await this.getOrCreateWeeklySessionRecord(teamId, slot, dateStr);
        const roster = await this.rosterFor(session);
        return { ...session, roster };
    }
    async handleSaturdaySessionsCron() {
        const academies = await this.prisma.academy.findMany({ where: { status: 'ACTIVE' } });
        for (const academy of academies) {
            await this.tenantContext.run({ academyId: academy.id, slug: academy.slug }, async () => {
                const result = await this.provisionSaturdaySessions();
                this.logger.log(`Weekly training sessions cron (${academy.slug}): created ${result.created} session(s), skipped ${result.skipped} already existing.`);
            });
        }
    }
    async provisionSaturdaySessions() {
        const academyId = this.tenantContext.getAcademyId();
        const slots = await this.listSchedule();
        const todaysSlots = slots.filter((slot) => slot.dayOfWeek === new Date().getUTCDay());
        if (todaysSlots.length === 0) {
            return { created: 0, skipped: 0 };
        }
        const teams = await this.prisma.team.findMany({ where: { academyId, isActive: true }, select: { id: true, name: true } });
        let created = 0;
        let skipped = 0;
        for (const slot of todaysSlots) {
            const date = this.resolveFixtureDate(slot.dayOfWeek);
            for (const team of teams) {
                const existing = await this.prisma.trainingSession.findFirst({
                    where: { teamId: team.id, date, startTime: slot.startTime, academyId },
                });
                if (existing) {
                    skipped++;
                    continue;
                }
                const session = await this.prisma.trainingSession.create({
                    data: {
                        academyId,
                        teamId: team.id,
                        date,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        location: slot.location ?? undefined,
                        status: 'SCHEDULED',
                    },
                });
                created++;
                await this.alertCoachesOfSaturdaySession(session, team.name);
            }
        }
        return { created, skipped };
    }
    async alertCoachesOfSaturdaySession(session, teamName) {
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
                where: { role: { name: permissions_constants_1.ROLE_NAMES.HEAD_COACH }, user: { academyId, status: 'ACTIVE', deletedAt: null } },
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
        const dayName = session.date.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
        const timeLabel = `${session.startTime ?? DEFAULT_TRAINING_START_TIME}–${session.endTime ?? DEFAULT_TRAINING_END_TIME}`;
        const subject = `${dayName} training session created — ${teamName}`;
        const message = `A ${dayName} training session for ${teamName} has been scheduled for ${dateLabel}, ${timeLabel}${session.location ? ` at ${session.location}` : ''}.`;
        await Promise.all(Array.from(recipients.values()).map((recipient) => Promise.all([
            recipient.email ? this.email.send({ to: recipient.email, subject, html: `<p>${message}</p>` }) : Promise.resolve(false),
            recipient.phone ? this.sms.send(recipient.phone, message) : Promise.resolve(false),
        ])));
    }
    async quickMarkAttendance(playerId, user, status = 'PRESENT') {
        const academyId = this.tenantContext.getAcademyId();
        const player = await this.prisma.player.findFirst({ where: { id: playerId, academyId } });
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
        const slots = await this.listSchedule();
        const slot = this.pickRelevantSlot(slots);
        const session = await this.getOrCreateWeeklySessionRecord(player.teamId, slot);
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
                academyId: session.academyId,
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
        const session = await this.assertCanManageSession(sessionId, user);
        const sortOrder = await this.prisma.trainingSessionActivity.count({ where: { trainingSessionId: sessionId } });
        await this.prisma.trainingSessionActivity.create({
            data: { academyId: session.academyId, trainingSessionId: sessionId, name: dto.name, sortOrder },
        });
        return this.findOneSession(sessionId);
    }
    async removeSessionActivity(sessionId, activityId, user) {
        const session = await this.assertCanManageSession(sessionId, user);
        const activity = await this.prisma.trainingSessionActivity.findFirst({
            where: { id: activityId, trainingSessionId: sessionId, academyId: session.academyId },
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
    (0, schedule_1.Cron)('0 6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrainingService.prototype, "handleSaturdaySessionsCron", null);
exports.TrainingService = TrainingService = TrainingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        coach_context_service_1.CoachContextService,
        email_service_1.EmailService,
        sms_service_1.SmsService,
        tenant_context_service_1.TenantContextService])
], TrainingService);
//# sourceMappingURL=training.service.js.map