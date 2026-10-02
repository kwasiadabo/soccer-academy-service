import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PlatformEmailService } from '../billing/platform-email.service';
import { PrismaService } from '../prisma/prisma.service';
interface TokenPair {
    accessToken: string;
    refreshToken: string;
    academySlug: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly config;
    private readonly platformEmail;
    private readonly tenantContext;
    private readonly logger;
    private readonly accessTokenJwt;
    private readonly refreshTokenJwt;
    constructor(prisma: PrismaService, config: ConfigService, platformEmail: PlatformEmailService, tenantContext: TenantContextService);
    validateCredentials(email: string, password: string): Promise<{
        roles: ({
            role: {
                permissions: ({
                    permission: {
                        id: string;
                        createdAt: Date;
                        description: string | null;
                        key: string;
                    };
                } & {
                    id: string;
                    roleId: string;
                    permissionId: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isSystem: boolean;
            };
        } & {
            id: string;
            academyId: string;
            userId: string;
            roleId: string;
            grantedAt: Date;
        })[];
    } & {
        id: string;
        academyId: string;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        mustChangePassword: boolean;
        refreshTokenHash: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    private buildPayload;
    login(email: string, password: string): Promise<{
        tokens: TokenPair;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: string[];
            mustChangePassword: boolean;
        };
    }>;
    private issueTokens;
    refresh(refreshToken: string): Promise<TokenPair>;
    logout(userId: string): Promise<void>;
    getAccessTokenVerifier(): JwtService;
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        mustChangePassword: boolean;
    }>;
}
export {};
