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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const permissions_constants_1 = require("../rbac/permissions.constants");
const userListSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    status: true,
    mustChangePassword: true,
    lastLoginAt: true,
    createdAt: true,
    roles: { select: { role: { select: { name: true } } } },
};
let UsersService = class UsersService {
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            where: { deletedAt: null },
            select: userListSelect,
            orderBy: { createdAt: 'desc' },
        });
        return users.map(this.serialize);
    }
    async findOne(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: userListSelect,
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.serialize(user);
    }
    async resolveRoles(roleNames) {
        const roles = await this.prisma.role.findMany({ where: { name: { in: roleNames } } });
        if (roles.length !== roleNames.length) {
            const found = new Set(roles.map((r) => r.name));
            const missing = roleNames.filter((n) => !found.has(n));
            throw new common_1.NotFoundException(`Unknown role(s): ${missing.join(', ')}`);
        }
        return roles;
    }
    async create(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('A user with this email already exists');
        }
        const roles = await this.resolveRoles(dto.roleNames);
        const mustChangePassword = dto.mustChangePassword ?? dto.roleNames.includes(permissions_constants_1.ROLE_NAMES.PARENT);
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                mustChangePassword,
                roles: { create: roles.map((role) => ({ roleId: role.id })) },
            },
            select: userListSelect,
        });
        return this.serialize(user);
    }
    async update(id, dto) {
        const existing = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
        if (!existing) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.email && dto.email !== existing.email) {
            const emailTaken = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (emailTaken) {
                throw new common_1.ConflictException('A user with this email already exists');
            }
        }
        const roles = dto.roleNames ? await this.resolveRoles(dto.roleNames) : null;
        const user = await this.prisma.$transaction(async (tx) => {
            if (roles) {
                await tx.userRole.deleteMany({ where: { userId: id } });
                await tx.userRole.createMany({ data: roles.map((role) => ({ userId: id, roleId: role.id })) });
            }
            return tx.user.update({
                where: { id },
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    phone: dto.phone,
                    status: dto.status,
                },
                select: userListSelect,
            });
        });
        return this.serialize(user);
    }
    async remove(id, requestingUserId) {
        if (id === requestingUserId) {
            throw new common_1.BadRequestException('You cannot delete your own account');
        }
        const existing = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
        if (!existing) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), refreshTokenHash: null },
        });
    }
    async resetPassword(id, dto) {
        const user = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.password) {
            const passwordHash = await bcrypt.hash(dto.password, 10);
            await this.prisma.user.update({
                where: { id },
                data: { passwordHash, mustChangePassword: true, refreshTokenHash: null },
            });
            return { mode: 'temporary-password' };
        }
        await this.authService.requestPasswordReset(user.email);
        return { mode: 'reset-link' };
    }
    serialize(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            status: user.status,
            mustChangePassword: user.mustChangePassword,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            roles: user.roles.map((r) => r.role.name),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], UsersService);
//# sourceMappingURL=users.service.js.map