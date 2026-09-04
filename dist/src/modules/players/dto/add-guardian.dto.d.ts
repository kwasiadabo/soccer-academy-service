import { GuardianRelationship } from '@prisma/client';
export declare class AddGuardianDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    address?: string;
    relationship: GuardianRelationship;
    isPrimary?: boolean;
}
