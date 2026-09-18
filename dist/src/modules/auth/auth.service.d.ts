import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PlatformEmailService } from '../billing/platform-email.service';
import { PrismaService } from '../prisma/prisma.service';
interface TokenPair {
    accessToken: string;
    refreshToken: string;
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
                        key: string;
                        description: string | null;
                    };
                } & {
                    id: string;
                    roleId: string;
                    permissionId: string;
                })[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isSystem: boolean;
            };
        } & {
            id: string;
            roleId: string;
            academyId: string;
            userId: string;
            grantedAt: Date;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        academyId: string;
        phone: string | null;
        mustChangePassword: boolean;
        refreshTokenHash: string | null;
        lastLoginAt: Date | null;
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
