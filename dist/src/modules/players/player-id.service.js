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
exports.PlayerIdService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
const DEFAULT_ACADEMY_CODE = 'ACA';
const ACADEMY_CODE_SETTING_KEY = 'player_id.academy_code';
let PlayerIdService = class PlayerIdService {
    constructor(prisma, tenantContext) {
        this.prisma = prisma;
        this.tenantContext = tenantContext;
    }
    async generate(ageCategoryCode, dateOfBirth) {
        const academyId = this.tenantContext.getAcademyId();
        const academyCode = await this.getAcademyCode(academyId);
        const birthYear = dateOfBirth.getUTCFullYear();
        const prefix = `${academyCode}-${ageCategoryCode}-${birthYear}-`;
        const existingCount = await this.prisma.player.count({
            where: { playerCode: { startsWith: prefix }, academyId },
        });
        return `${prefix}${String(existingCount + 1).padStart(5, '0')}`;
    }
    async getAcademyCode(academyId) {
        const setting = await this.prisma.configurationSetting.findFirst({
            where: { key: ACADEMY_CODE_SETTING_KEY, academyId },
        });
        if (setting && typeof setting.value === 'string') {
            return setting.value;
        }
        return DEFAULT_ACADEMY_CODE;
    }
};
exports.PlayerIdService = PlayerIdService;
exports.PlayerIdService = PlayerIdService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_context_service_1.TenantContextService])
], PlayerIdService);
//# sourceMappingURL=player-id.service.js.map