import { CoachAssignmentRole } from '@prisma/client';
export declare class CreateCoachAssignmentDto {
    teamId?: string;
    trainingGroupId?: string;
    role: CoachAssignmentRole;
    effectiveFrom?: string;
}
export declare class EndCoachAssignmentDto {
    effectiveTo?: string;
}
