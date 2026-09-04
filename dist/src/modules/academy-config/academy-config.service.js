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
exports.AcademyConfigService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AcademyConfigService = class AcademyConfigService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    listSeasons() {
        return this.prisma.season.findMany({ orderBy: { startDate: 'desc' } });
    }
    async createSeason(dto) {
        return this.prisma.season.create({
            data: { name: dto.name, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate) },
        });
    }
    async updateSeason(id, dto) {
        await this.ensureExists('season', id);
        return this.prisma.season.update({
            where: { id },
            data: {
                name: dto.name,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                isActive: dto.isActive,
            },
        });
    }
    listAgeCategories() {
        return this.prisma.ageCategory.findMany({ orderBy: { sortOrder: 'asc' } });
    }
    createAgeCategory(dto) {
        return this.prisma.ageCategory.create({
            data: {
                name: dto.name,
                code: dto.code,
                minAge: dto.minAge,
                maxAge: dto.maxAge,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async updateAgeCategory(id, dto) {
        await this.ensureExists('ageCategory', id);
        return this.prisma.ageCategory.update({ where: { id }, data: dto });
    }
    listTeams() {
        return this.prisma.team.findMany({
            include: {
                ageCategory: true,
                season: true,
                headCoach: true,
                coachAssignments: {
                    where: { effectiveTo: null },
                    include: { coach: true },
                    orderBy: { effectiveFrom: 'asc' },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    createTeam(dto) {
        return this.prisma.team.create({
            data: {
                name: dto.name,
                ageCategoryId: dto.ageCategoryId,
                seasonId: dto.seasonId,
                headCoachId: dto.headCoachId,
            },
        });
    }
    async updateTeam(id, dto) {
        await this.ensureExists('team', id);
        return this.prisma.team.update({ where: { id }, data: dto });
    }
    listTrainingGroups() {
        return this.prisma.trainingGroup.findMany({
            include: { team: true, primaryCoach: true },
            orderBy: { name: 'asc' },
        });
    }
    createTrainingGroup(dto) {
        return this.prisma.trainingGroup.create({
            data: { name: dto.name, teamId: dto.teamId, primaryCoachId: dto.primaryCoachId },
        });
    }
    async updateTrainingGroup(id, dto) {
        await this.ensureExists('trainingGroup', id);
        return this.prisma.trainingGroup.update({ where: { id }, data: dto });
    }
    async ensureExists(model, id) {
        const finders = {
            season: (recordId) => this.prisma.season.findUnique({ where: { id: recordId } }),
            ageCategory: (recordId) => this.prisma.ageCategory.findUnique({ where: { id: recordId } }),
            team: (recordId) => this.prisma.team.findUnique({ where: { id: recordId } }),
            trainingGroup: (recordId) => this.prisma.trainingGroup.findUnique({ where: { id: recordId } }),
        };
        const record = await finders[model](id);
        if (!record) {
            throw new common_1.NotFoundException(`${model} not found`);
        }
    }
};
exports.AcademyConfigService = AcademyConfigService;
exports.AcademyConfigService = AcademyConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademyConfigService);
//# sourceMappingURL=academy-config.service.js.map