import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';
export declare class UsersService {
    private readonly prisma;
    private readonly authService;
    constructor(prisma: PrismaService, authService: AuthService);
    findAll(): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: string;
        mustChangePassword: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        roles: string[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: string;
        mustChangePassword: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        roles: string[];
    }>;
    private resolveRoles;
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: string;
        mustChangePassword: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        roles: string[];
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: string;
        mustChangePassword: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        roles: string[];
    }>;
    remove(id: string, requestingUserId: string): Promise<void>;
    resetPassword(id: string, dto: ResetUserPasswordDto): Promise<{
        mode: "temporary-password";
    } | {
        mode: "reset-link";
    }>;
    private serialize;
}
