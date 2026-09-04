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
exports.CoachContextService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const permissions_constants_1 = require("../rbac/permissions.constants");
let CoachContextService = class CoachContextService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveCoachId(userId) {
        const coach = await this.prisma.coach.findFirst({ where: { userId, deletedAt: null } });
        if (!coach) {
            throw new common_1.ForbiddenException('No coach profile is linked to this account');
        }
        return coach.id;
    }
    async assertOwnsTeam(coachId, teamId) {
        const assignment = await this.prisma.coachAssignment.findFirst({
            where: { coachId, teamId, effectiveTo: null },
        });
        if (!assignment) {
            throw new common_1.ForbiddenException('You are not assigned to this team');
        }
    }
    async assertOwnsTrainingGroup(coachId, trainingGroupId) {
        const assignment = await this.prisma.coachAssignment.findFirst({
            where: { coachId, trainingGroupId, effectiveTo: null },
        });
        if (!assignment) {
            throw new common_1.ForbiddenException('You are not assigned to this training group');
        }
    }
    async getAssignedTeamIds(coachId) {
        const assignments = await this.prisma.coachAssignment.findMany({
            where: { coachId, effectiveTo: null, teamId: { not: null } },
            select: { teamId: true },
        });
        return assignments.map((a) => a.teamId);
    }
    async getAssignedTrainingGroupIds(coachId) {
        const assignments = await this.prisma.coachAssignment.findMany({
            where: { coachId, effectiveTo: null, trainingGroupId: { not: null } },
            select: { trainingGroupId: true },
        });
        return assignments.map((a) => a.trainingGroupId);
    }
    isCoachOnly(user) {
        return (user.roles.includes(permissions_constants_1.ROLE_NAMES.COACH) &&
            !user.roles.includes(permissions_constants_1.ROLE_NAMES.HEAD_COACH) &&
            !user.roles.includes(permissions_constants_1.ROLE_NAMES.ADMIN));
    }
    async assertOwnsTeamOrGroup(coachId, entity, notOwnedMessage) {
        const assignment = await this.prisma.coachAssignment.findFirst({
            where: {
                coachId,
                effectiveTo: null,
                OR: [
                    entity.teamId ? { teamId: entity.teamId } : undefined,
                    entity.trainingGroupId ? { trainingGroupId: entity.trainingGroupId } : undefined,
                ].filter((c) => !!c),
            },
        });
        if (!assignment) {
            throw new common_1.ForbiddenException(notOwnedMessage);
        }
    }
    async assertOwnsPlayer(coachId, player) {
        await this.assertOwnsTeamOrGroup(coachId, player, 'This player is not on one of your assigned teams or training groups');
    }
    async assertOwnsSession(coachId, session) {
        await this.assertOwnsTeamOrGroup(coachId, session, 'You do not have access to this training session');
    }
    async assertOwnsOrConductedSession(coachId, session) {
        if (session.conductedByCoachId === coachId)
            return;
        await this.assertOwnsTeamOrGroup(coachId, session, 'You were not in charge of this training session');
    }
    async assertOwnsPlan(coachId, plan) {
        await this.assertOwnsTeamOrGroup(coachId, plan, 'You do not have access to this training plan');
    }
};
exports.CoachContextService = CoachContextService;
exports.CoachContextService = CoachContextService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoachContextService);
//# sourceMappingURL=coach-context.service.js.map