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
exports.GuardianContextService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GuardianContextService = class GuardianContextService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveGuardianId(userId) {
        const guardian = await this.prisma.guardian.findFirst({ where: { userId, deletedAt: null } });
        if (!guardian) {
            throw new common_1.ForbiddenException('No guardian profile is linked to this account');
        }
        return guardian.id;
    }
    async resolvePlayerIds(guardianId) {
        const links = await this.prisma.playerGuardian.findMany({
            where: { guardianId },
            select: { playerId: true },
        });
        return links.map((l) => l.playerId);
    }
    async assertOwnsPlayer(guardianId, playerId) {
        const link = await this.prisma.playerGuardian.findUnique({
            where: { playerId_guardianId: { playerId, guardianId } },
        });
        if (!link) {
            throw new common_1.ForbiddenException('This player is not linked to your account');
        }
    }
};
exports.GuardianContextService = GuardianContextService;
exports.GuardianContextService = GuardianContextService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GuardianContextService);
//# sourceMappingURL=guardian-context.service.js.map