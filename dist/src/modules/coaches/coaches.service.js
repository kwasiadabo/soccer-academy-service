"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
let CoachesService = class CoachesService {
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async findAll(search) {
        return this.prisma.coach.findMany({
            where: {
                deletedAt: null,
                ...(search
                    ? {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            include: { user: { select: { id: true, email: true, roles: { select: { role: { select: { name: true } } } } } } },
            orderBy: { lastName: 'asc' },
        });
    }
    async findOne(id) {
        const coach = await this.prisma.coach.findFirst({
            where: { id, deletedAt: null },
            include: {
                user: { select: { id: true, email: true, roles: { select: { role: { select: { name: true } } } } } },
                qualifications: true,
                assignments: { include: { team: true, trainingGroup: true } },
            },
        });
        if (!coach) {
            throw new common_1.NotFoundException('Coach not found');
        }
        return coach;
    }
    create(dto) {
        return this.prisma.coach.create({ data: dto });
    }
    async update(id, dto) {
        const coach = await this.findOne(id);
        const { isActive, ...rest } = dto;
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.coach.update({ where: { id }, data: { ...rest, isActive } });
            if (isActive !== undefined && coach.userId) {
                await tx.user.update({
                    where: { id: coach.userId },
                    data: { status: isActive ? 'ACTIVE' : 'SUSPENDED' },
                });
            }
            return updated;
        });
    }
    async grantPortalAccess(id, dto) {
        const coach = await this.findOne(id);
        if (coach.userId) {
            throw new common_1.BadRequestException('This coach already has portal access');
        }
        let user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (user) {
            const alreadyLinked = await this.prisma.coach.findFirst({ where: { userId: user.id } });
            const linkedGuardian = await this.prisma.guardian.findFirst({ where: { userId: user.id } });
            if (alreadyLinked || linkedGuardian) {
                throw new common_1.ConflictException('This email is already linked to a different portal profile');
            }
            const roles = await this.prisma.role.findMany({ where: { name: { in: dto.roleNames } } });
            const existingRoleIds = new Set((await this.prisma.userRole.findMany({ where: { userId: user.id } })).map((r) => r.roleId));
            const rolesToAdd = roles.filter((r) => !existingRoleIds.has(r.id));
            await this.prisma.$transaction([
                this.prisma.userRole.createMany({
                    data: rolesToAdd.map((role) => ({ userId: user.id, roleId: role.id })),
                }),
                this.prisma.coach.update({ where: { id }, data: { userId: user.id } }),
            ]);
        }
        else {
            const roles = await this.prisma.role.findMany({ where: { name: { in: dto.roleNames } } });
            if (roles.length !== dto.roleNames.length) {
                const found = new Set(roles.map((r) => r.name));
                const missing = dto.roleNames.filter((n) => !found.has(n));
                throw new common_1.NotFoundException(`Unknown role(s): ${missing.join(', ')}`);
            }
            const passwordHash = await bcrypt.hash((0, crypto_1.randomBytes)(32).toString('hex'), 10);
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    firstName: coach.firstName,
                    lastName: coach.lastName,
                    phone: coach.phone,
                    roles: { create: roles.map((role) => ({ roleId: role.id })) },
                },
            });
            await this.prisma.coach.update({ where: { id }, data: { userId: user.id } });
        }
        await this.authService.requestPasswordReset(dto.email);
        return this.findOne(id);
    }
    async addQualification(coachId, dto) {
        await this.findOne(coachId);
        await this.prisma.coachQualification.create({
            data: {
                coachId,
                title: dto.title,
                issuingBody: dto.issuingBody,
                issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
                expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
            },
        });
        return this.findOne(coachId);
    }
    async addAssignment(coachId, dto) {
        await this.findOne(coachId);
        if (!dto.teamId && !dto.trainingGroupId) {
            throw new common_1.BadRequestException('Specify a team or a training group to assign this coach to');
        }
        await this.prisma.coachAssignment.create({
            data: {
                coachId,
                teamId: dto.teamId,
                trainingGroupId: dto.trainingGroupId,
                role: dto.role,
                effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
            },
        });
        return this.findOne(coachId);
    }
    async endAssignment(coachId, assignmentId, dto) {
        await this.findOne(coachId);
        const assignment = await this.prisma.coachAssignment.findFirst({
            where: { id: assignmentId, coachId },
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Coach assignment not found');
        }
        await this.prisma.coachAssignment.update({
            where: { id: assignmentId },
            data: { effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : new Date() },
        });
        return this.findOne(coachId);
    }
};
exports.CoachesService = CoachesService;
exports.CoachesService = CoachesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], CoachesService);
//# sourceMappingURL=coaches.service.js.map