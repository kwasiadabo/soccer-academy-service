import { DominantFoot, Gender } from '@prisma/client';
export declare class UpdatePlayerDto {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: Gender;
    nationality?: string;
    residentialAddress?: string;
    medicalNotes?: string;
    previousExperience?: string;
    preferredPosition?: string;
    dominantFoot?: DominantFoot;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    ageCategoryId?: string;
    teamId?: string;
    trainingGroupId?: string;
}
