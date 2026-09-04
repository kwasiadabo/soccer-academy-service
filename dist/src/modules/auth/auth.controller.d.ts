import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RequestUser } from './types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, res: Response): Promise<AuthResponseDto>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: true;
    }>;
    changePassword(user: RequestUser, dto: ChangePasswordDto): Promise<{
        success: true;
    }>;
    me(user: RequestUser): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        mustChangePassword: boolean;
    }>;
    logout(user: RequestUser, res: Response): Promise<{
        success: true;
    }>;
}
