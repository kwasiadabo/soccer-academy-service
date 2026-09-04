import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    private readonly accessTokenJwt;
    private readonly refreshTokenJwt;
    constructor(prisma: PrismaService, config: ConfigService);
    validateCredentials(email: string, password: string): Promise<{
        roles: ({
            role: {
                permissions: ({
                    permission: {
                        id: string;
                        key: string;
                        description: string | null;
                        createdAt: Date;
                    };
                } & {
                    id: string;
                    roleId: string;
                    permissionId: string;
                })[];
            } & {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                isSystem: boolean;
                updatedAt: Date;
            };
        } & {
            id: string;
            roleId: string;
            userId: string;
            grantedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
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
