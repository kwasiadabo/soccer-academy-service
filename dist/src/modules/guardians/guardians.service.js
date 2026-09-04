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
exports.GuardiansService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const permissions_constants_1 = require("../rbac/permissions.constants");
let GuardiansService = class GuardiansService {
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async findAll(search) {
        return this.prisma.guardian.findMany({
            where: {
                deletedAt: null,
                ...(search
                    ? {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } },
                            { phone: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            include: { players: { include: { player: true } } },
            orderBy: { lastName: 'asc' },
        });
    }
    async findOne(id) {
        const guardian = await this.prisma.guardian.findFirst({
            where: { id, deletedAt: null },
            include: { players: { include: { player: true } } },
        });
        if (!guardian) {
            throw new common_1.NotFoundException('Guardian not found');
        }
        return guardian;
    }
    async grantPortalAccess(id, dto) {
        const guardian = await this.findOne(id);
        if (guardian.userId) {
            throw new common_1.BadRequestException('This guardian already has portal access');
        }
        let user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (user) {
            const linkedCoach = await this.prisma.coach.findFirst({ where: { userId: user.id } });
            const linkedGuardian = await this.prisma.guardian.findFirst({ where: { userId: user.id } });
            if (linkedCoach || linkedGuardian) {
                throw new common_1.ConflictException('This email is already linked to a different portal profile');
            }
            const parentRole = await this.prisma.role.findUniqueOrThrow({ where: { name: permissions_constants_1.ROLE_NAMES.PARENT } });
            const alreadyHasRole = await this.prisma.userRole.findUnique({
                where: { userId_roleId: { userId: user.id, roleId: parentRole.id } },
            });
            await this.prisma.$transaction([
                ...(alreadyHasRole
                    ? []
                    : [this.prisma.userRole.create({ data: { userId: user.id, roleId: parentRole.id } })]),
                this.prisma.guardian.update({ where: { id }, data: { userId: user.id } }),
            ]);
        }
        else {
            const parentRole = await this.prisma.role.findUniqueOrThrow({ where: { name: permissions_constants_1.ROLE_NAMES.PARENT } });
            const passwordHash = await bcrypt.hash((0, crypto_1.randomBytes)(32).toString('hex'), 10);
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    firstName: guardian.firstName,
                    lastName: guardian.lastName,
                    phone: guardian.phone,
                    mustChangePassword: true,
                    roles: { create: { roleId: parentRole.id } },
                },
            });
            await this.prisma.guardian.update({ where: { id }, data: { userId: user.id } });
        }
        await this.authService.requestPasswordReset(dto.email);
        return this.findOne(id);
    }
};
exports.GuardiansService = GuardiansService;
exports.GuardiansService = GuardiansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], GuardiansService);
//# sourceMappingURL=guardians.service.js.map