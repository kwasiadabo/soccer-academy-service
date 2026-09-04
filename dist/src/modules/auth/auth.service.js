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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.accessTokenJwt = new jwt_1.JwtService({
            secret: this.config.get('JWT_ACCESS_SECRET'),
            signOptions: { expiresIn: this.config.get('JWT_ACCESS_TTL') },
        });
        this.refreshTokenJwt = new jwt_1.JwtService({
            secret: this.config.get('JWT_REFRESH_SECRET'),
            signOptions: { expiresIn: this.config.get('JWT_REFRESH_TTL') },
        });
    }
    async validateCredentials(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: { role: { include: { permissions: { include: { permission: true } } } } },
                },
            },
        });
        if (!user || user.deletedAt || user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
    buildPayload(user) {
        const roles = user.roles.map((r) => r.role.name);
        const permissions = Array.from(new Set(user.roles.flatMap((r) => r.role.permissions.map((p) => p.permission.key))));
        return { sub: user.id, email: user.email, roles, permissions };
    }
    async login(email, password) {
        const user = await this.validateCredentials(email, password);
        const payload = this.buildPayload(user);
        const tokens = await this.issueTokens(payload);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date(), refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10) },
        });
        return {
            tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: payload.roles,
                mustChangePassword: user.mustChangePassword,
            },
        };
    }
    async issueTokens(payload) {
        const accessToken = await this.accessTokenJwt.signAsync(payload);
        const refreshToken = await this.refreshTokenJwt.signAsync({ sub: payload.sub });
        return { accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        let decoded;
        try {
            decoded = await this.refreshTokenJwt.verifyAsync(refreshToken);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: decoded.sub },
            include: {
                roles: {
                    include: { role: { include: { permissions: { include: { permission: true } } } } },
                },
            },
        });
        if (!user || !user.refreshTokenHash || user.status !== 'ACTIVE' || user.deletedAt) {
            throw new common_1.UnauthorizedException('Session expired, please log in again');
        }
        const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!matches) {
            await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash: null } });
            throw new common_1.ForbiddenException('Refresh token invalid, session revoked');
        }
        const payload = this.buildPayload(user);
        const tokens = await this.issueTokens(payload);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10) },
        });
        return tokens;
    }
    async logout(userId) {
        await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
    }
    getAccessTokenVerifier() {
        return this.accessTokenJwt;
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || user.deletedAt || user.status !== 'ACTIVE') {
            return;
        }
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const tokenHash = (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
        await this.prisma.$transaction([
            this.prisma.passwordResetToken.deleteMany({
                where: { userId: user.id, usedAt: null },
            }),
            this.prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    tokenHash,
                    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
                },
            }),
        ]);
        const appUrl = this.config.get('CORS_ORIGIN') ?? 'http://localhost:5173';
        const resetLink = `${appUrl}/reset-password?token=${rawToken}`;
        this.logger.log(`Password reset requested for ${user.email}: ${resetLink}`);
    }
    async resetPassword(token, newPassword) {
        const tokenHash = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { tokenHash },
        });
        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired reset link');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash, refreshTokenHash: null, mustChangePassword: false },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
        ]);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
        const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash, refreshTokenHash: null, mustChangePassword: false },
        });
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: { roles: { include: { role: true } } },
        });
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles.map((r) => r.role.name),
            mustChangePassword: user.mustChangePassword,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map