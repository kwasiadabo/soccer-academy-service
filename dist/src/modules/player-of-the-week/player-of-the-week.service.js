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
var PlayerOfTheWeekService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerOfTheWeekService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
function resolveSaturday() {
    const base = new Date();
    const day = base.getUTCDay();
    const daysSinceSaturday = (day + 1) % 7;
    return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() - daysSinceSaturday));
}
let PlayerOfTheWeekService = PlayerOfTheWeekService_1 = class PlayerOfTheWeekService {
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
        this.logger = new common_1.Logger(PlayerOfTheWeekService_1.name);
    }
    async handleWeeklyComputationCron() {
        const result = await this.computeForAllTeams();
        this.logger.log(`Player of the Week: picked ${result.picked}, skipped ${result.skipped} (no session/marks/already picked).`);
    }
    async computeForAllTeams() {
        const weekOf = resolveSaturday();
        const teams = await this.prisma.team.findMany({ where: { isActive: true }, select: { id: true } });
        let picked = 0;
        let skipped = 0;
        for (const team of teams) {
            const session = await this.prisma.trainingSession.findFirst({ where: { teamId: team.id, date: weekOf } });
            if (!session) {
                skipped++;
                continue;
            }
            const existingAward = await this.prisma.playerOfTheWeek.findUnique({
                where: { trainingSessionId: session.id },
            });
            if (existingAward) {
                skipped++;
                continue;
            }
            const marks = await this.prisma.trainingActivityMark.findMany({
                where: { trainingActivity: { trainingPlan: { teamId: team.id, scheduledDate: weekOf } } },
                select: { playerId: true, rating: true },
            });
            if (marks.length === 0) {
                skipped++;
                continue;
            }
            const totals = new Map();
            for (const mark of marks) {
                const entry = totals.get(mark.playerId) ?? { sum: 0, count: 0 };
                entry.sum += mark.rating;
                entry.count += 1;
                totals.set(mark.playerId, entry);
            }
            let bestPlayerId = null;
            let bestAverage = -Infinity;
            for (const [playerId, { sum, count }] of totals) {
                const average = sum / count;
                if (average > bestAverage) {
                    bestAverage = average;
                    bestPlayerId = playerId;
                }
            }
            if (!bestPlayerId) {
                skipped++;
                continue;
            }
            await this.prisma.playerOfTheWeek.create({
                data: {
                    playerId: bestPlayerId,
                    teamId: team.id,
                    trainingSessionId: session.id,
                    weekOf,
                    averageRating: Math.round(bestAverage * 100) / 100,
                },
            });
            picked++;
        }
        return { picked, skipped };
    }
    async findPublicFeed() {
        const awards = await this.prisma.playerOfTheWeek.findMany({
            orderBy: { weekOf: 'desc' },
            take: 24,
            include: {
                player: { select: { firstName: true, lastName: true, photoDocumentId: true } },
                team: { select: { name: true } },
            },
        });
        return awards
            .filter((award) => award.player.photoDocumentId)
            .map((award) => ({
            id: award.id,
            firstName: award.player.firstName,
            lastInitial: award.player.lastName.charAt(0),
            teamName: award.team.name,
            weekOf: award.weekOf,
            averageRating: Number(award.averageRating),
            photoUrl: `/api/player-of-the-week/public/${award.id}/photo`,
        }));
    }
    async getPublicPhoto(awardId) {
        const award = await this.prisma.playerOfTheWeek.findUnique({
            where: { id: awardId },
            include: { player: { include: { photo: true } } },
        });
        if (!award?.player.photo) {
            throw new common_1.NotFoundException('No photo available for this award');
        }
        const buffer = await this.storage.read(award.player.photo.storageKey);
        return { buffer, mimeType: award.player.photo.mimeType };
    }
};
exports.PlayerOfTheWeekService = PlayerOfTheWeekService;
__decorate([
    (0, schedule_1.Cron)('0 11 * * 6'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlayerOfTheWeekService.prototype, "handleWeeklyComputationCron", null);
exports.PlayerOfTheWeekService = PlayerOfTheWeekService = PlayerOfTheWeekService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], PlayerOfTheWeekService);
//# sourceMappingURL=player-of-the-week.service.js.map