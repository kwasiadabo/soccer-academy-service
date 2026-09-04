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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const coach_context_service_1 = require("../coaches/coach-context.service");
const permissions_constants_1 = require("../rbac/permissions.constants");
const TEMPLATE_INCLUDE = {
    criteria: { orderBy: { sortOrder: 'asc' } },
};
const ASSESSMENT_INCLUDE = {
    ratings: { include: { criteria: true, sessionActivity: true } },
    assessedByCoach: { select: { id: true, firstName: true, lastName: true } },
    template: true,
};
const ASSESSMENT_OVERSIGHT_INCLUDE = {
    ...ASSESSMENT_INCLUDE,
    player: { select: { id: true, firstName: true, lastName: true, team: { select: { id: true, name: true } } } },
};
let AssessmentsService = class AssessmentsService {
    constructor(prisma, coachContext) {
        this.prisma = prisma;
        this.coachContext = coachContext;
    }
    canViewAll(user) {
        return user.permissions.includes(permissions_constants_1.PERMISSIONS.ASSESSMENTS_VIEW);
    }
    findAllTemplates() {
        return this.prisma.assessmentTemplate.findMany({
            where: { isActive: true },
            include: TEMPLATE_INCLUDE,
            orderBy: { name: 'asc' },
        });
    }
    async createTemplate(dto) {
        const { criteria, ...rest } = dto;
        return this.prisma.assessmentTemplate.create({
            data: {
                ...rest,
                criteria: criteria?.length ? { create: criteria } : undefined,
            },
            include: TEMPLATE_INCLUDE,
        });
    }
    async updateTemplate(id, dto) {
        await this.getTemplateOrThrow(id);
        return this.prisma.assessmentTemplate.update({ where: { id }, data: dto, include: TEMPLATE_INCLUDE });
    }
    async addCriteria(templateId, dto) {
        await this.getTemplateOrThrow(templateId);
        await this.prisma.assessmentCriteria.create({ data: { ...dto, templateId } });
        return this.prisma.assessmentTemplate.findUniqueOrThrow({
            where: { id: templateId },
            include: TEMPLATE_INCLUDE,
        });
    }
    async getTemplateOrThrow(id) {
        const template = await this.prisma.assessmentTemplate.findUnique({ where: { id } });
        if (!template) {
            throw new common_1.NotFoundException('Assessment template not found');
        }
        return template;
    }
    findAllOversight(teamId, trainingSessionId) {
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
    async findForPlayer(playerId, user) {
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
    async assertValidRatings(ratings, templateId, trainingSessionId) {
        if (templateId) {
            if (ratings.some((r) => r.sessionActivityId)) {
                throw new common_1.BadRequestException('Ratings cannot reference a session activity when a template is used');
            }
            if (ratings.some((r) => !r.criteriaId)) {
                throw new common_1.BadRequestException('Every rating must reference a criteria when a template is used');
            }
            return;
        }
        if (!trainingSessionId) {
            throw new common_1.BadRequestException('trainingSessionId is required when templateId is not provided');
        }
        if (ratings.some((r) => r.criteriaId)) {
            throw new common_1.BadRequestException('Ratings cannot reference a criteria without a template');
        }
        if (ratings.some((r) => !r.sessionActivityId)) {
            throw new common_1.BadRequestException('Every rating must reference a session activity when no template is used');
        }
        const activityIds = [...new Set(ratings.map((r) => r.sessionActivityId))];
        const matching = await this.prisma.trainingSessionActivity.findMany({
            where: { id: { in: activityIds }, trainingSessionId },
            select: { id: true },
        });
        if (matching.length !== activityIds.length) {
            throw new common_1.BadRequestException('One or more activities do not belong to this training session');
        }
    }
    async assertPlayerIsActive(playerId) {
        const player = await this.prisma.player.findUnique({ where: { id: playerId }, select: { status: true } });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        if (player.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('This player cannot be assessed until their registration payment is complete');
        }
    }
    async assertCanAssessPlayer(coachId, playerId, trainingSessionId) {
        if (trainingSessionId) {
            const session = await this.prisma.trainingSession.findUnique({
                where: { id: trainingSessionId },
                select: { teamId: true, trainingGroupId: true, conductedByCoachId: true },
            });
            if (!session) {
                throw new common_1.NotFoundException('Training session not found');
            }
            await this.coachContext.assertOwnsOrConductedSession(coachId, session);
            return;
        }
        const player = await this.prisma.player.findUnique({
            where: { id: playerId },
            select: { teamId: true, trainingGroupId: true },
        });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        await this.coachContext.assertOwnsPlayer(coachId, player);
    }
    async createAssessment(playerId, userId, dto) {
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
    async updateAssessment(playerId, assessmentId, userId, dto) {
        const existing = await this.prisma.playerAssessment.findUnique({ where: { id: assessmentId } });
        if (!existing || existing.playerId !== playerId || existing.deletedAt) {
            throw new common_1.NotFoundException('Assessment not found');
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
    async findRemarksForPlayer(playerId, user) {
        return this.prisma.coachRemark.findMany({
            where: {
                playerId,
                coachId: this.canViewAll(user) ? undefined : await this.coachContext.resolveCoachId(user.userId),
            },
            include: { coach: { select: { id: true, firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createRemark(playerId, userId, dto) {
        const coachId = await this.coachContext.resolveCoachId(userId);
        const player = await this.prisma.player.findUnique({
            where: { id: playerId },
            select: { teamId: true, trainingGroupId: true, status: true },
        });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        await this.coachContext.assertOwnsPlayer(coachId, player);
        if (player.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('This player cannot be assessed until their registration payment is complete');
        }
        return this.prisma.coachRemark.create({
            data: { ...dto, playerId, coachId },
            include: { coach: { select: { id: true, firstName: true, lastName: true } } },
        });
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        coach_context_service_1.CoachContextService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map