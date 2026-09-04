import { DominantFoot, Gender, GuardianRelationship } from '@prisma/client';
export declare class CreateGuardianInputDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    address?: string;
    relationship: GuardianRelationship;
    isPrimary?: boolean;
}
export declare class CreatePlayerDto {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    nationality?: string;
    residentialAddress?: string;
    medicalNotes?: string;
    previousExperience?: string;
    preferredPosition?: string;
    dominantFoot?: DominantFoot;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    ageCategoryId?: string;
    guardians: CreateGuardianInputDto[];
}
