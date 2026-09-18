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
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
const coach_context_service_1 = require("../coaches/coach-context.service");
const permissions_constants_1 = require("../rbac/permissions.constants");
const MATCH_INCLUDE = {
    team: true,
    opponent: true,
    participations: { include: { player: { select: { id: true, firstName: true, lastName: true } } } },
    matchPlayerAssessments: true,
};
let MatchesService = class MatchesService {
    constructor(prisma, coachContext, tenantContext) {
        this.prisma = prisma;
        this.coachContext = coachContext;
        this.tenantContext = tenantContext;
    }
    isUnscoped(user) {
        return user.permissions.includes(permissions_constants_1.PERMISSIONS.TRAINING_APPROVE);
    }
    async assertCanManageTeam(user, teamId) {
        if (this.isUnscoped(user))
            return;
        const coachId = await this.coachContext.resolveCoachId(user.userId);
        await this.coachContext.assertOwnsTeam(coachId, teamId);
    }
    async assertCanRateMatch(user, teamId) {
        if (user.roles.includes(permissions_constants_1.ROLE_NAMES.ADMIN))
            return;
        const coachId = await this.coachContext.resolveCoachId(user.userId);
        await this.coachContext.assertOwnsTeam(coachId, teamId);
    }
    listOpponents() {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.opponent.findMany({ where: { academyId }, orderBy: { name: 'asc' } });
    }
    createOpponent(dto) {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.opponent.create({ data: { ...dto, academyId } });
    }
    async getMatchOrThrow(id) {
        const academyId = this.tenantContext.getAcademyId();
        const match = await this.prisma.match.findFirst({ where: { id, academyId }, include: MATCH_INCLUDE });
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        return match;
    }
    async findAll(user) {
        const academyId = this.tenantContext.getAcademyId();
        if (this.isUnscoped(user)) {
            return this.prisma.match.findMany({ where: { academyId }, include: MATCH_INCLUDE, orderBy: { matchDate: 'desc' } });
        }
        const coachId = await this.coachContext.resolveCoachId(user.userId);
        const teamIds = await this.coachContext.getAssignedTeamIds(coachId);
        return this.prisma.match.findMany({
            where: { academyId, teamId: { in: teamIds } },
            include: MATCH_INCLUDE,
            orderBy: { matchDate: 'desc' },
        });
    }
    async findOne(id, user) {
        const match = await this.getMatchOrThrow(id);
        await this.assertCanManageTeam(user, match.teamId);
        const roster = await this.prisma.player.findMany({
            where: { status: 'ACTIVE', deletedAt: null, teamId: match.teamId, academyId: match.academyId },
            select: { id: true, firstName: true, lastName: true },
            orderBy: { lastName: 'asc' },
        });
        return { ...match, roster };
    }
    async create(user, dto) {
        await this.assertCanManageTeam(user, dto.teamId);
        const academyId = this.tenantContext.getAcademyId();
        const { matchDate, ...rest } = dto;
        return this.prisma.match.create({
            data: { ...rest, academyId, matchDate: new Date(matchDate) },
            include: MATCH_INCLUDE,
        });
    }
    async update(id, user, dto) {
        const match = await this.getMatchOrThrow(id);
        await this.assertCanManageTeam(user, match.teamId);
        const { matchDate, ...rest } = dto;
        await this.prisma.match.update({
            where: { id, academyId: match.academyId },
            data: { ...rest, matchDate: matchDate ? new Date(matchDate) : undefined },
        });
        return this.getMatchOrThrow(id);
    }
    async assertPlayersAreActive(academyId, playerIds) {
        if (playerIds.length === 0)
            return;
        const players = await this.prisma.player.findMany({
            where: { id: { in: playerIds }, academyId },
            select: { id: true, status: true },
        });
        const inactive = players.filter((p) => p.status !== 'ACTIVE');
        if (inactive.length > 0) {
            throw new common_1.BadRequestException('One or more selected players cannot be added until their registration payment is complete');
        }
    }
    async setParticipations(id, user, dto) {
        const match = await this.getMatchOrThrow(id);
        await this.assertCanManageTeam(user, match.teamId);
        const existingPlayerIds = new Set(match.participations.map((p) => p.playerId));
        const newPlayerIds = dto.records.map((r) => r.playerId).filter((playerId) => !existingPlayerIds.has(playerId));
        await this.assertPlayersAreActive(match.academyId, newPlayerIds);
        await this.prisma.$transaction(dto.records.map((record) => this.prisma.matchParticipation.upsert({
            where: { matchId_playerId: { matchId: id, playerId: record.playerId } },
            create: { matchId: id, academyId: match.academyId, ...record },
            update: record,
        })));
        return this.getMatchOrThrow(id);
    }
    async addPlayerAssessment(id, user, dto) {
        const match = await this.getMatchOrThrow(id);
        await this.assertCanRateMatch(user, match.teamId);
        const coachId = await this.coachContext.resolveCoachId(user.userId);
        await this.assertPlayersAreActive(match.academyId, [dto.playerId]);
        const { playerId, ...ratings } = dto;
        await this.prisma.matchPlayerAssessment.upsert({
            where: { matchId_playerId: { matchId: id, playerId } },
            create: { matchId: id, playerId, academyId: match.academyId, assessedByCoachId: coachId, ...ratings },
            update: { assessedByCoachId: coachId, ...ratings },
        });
        return this.getMatchOrThrow(id);
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        coach_context_service_1.CoachContextService,
        tenant_context_service_1.TenantContextService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map