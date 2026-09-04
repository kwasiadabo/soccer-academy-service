import { StaffRole } from '@prisma/client';
export declare class CreateCoachDto {
    firstName: string;
    middleName?: string;
    lastName: string;
    phone?: string;
    email?: string;
    bio?: string;
    role?: StaffRole;
}
export declare class UpdateCoachDto {
    isActive?: boolean;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    bio?: string;
    role?: StaffRole;
}
