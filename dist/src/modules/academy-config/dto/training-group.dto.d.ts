export declare class CreateTrainingGroupDto {
    name: string;
    teamId: string;
    primaryCoachId?: string;
}
export declare class UpdateTrainingGroupDto {
    name?: string;
    primaryCoachId?: string;
    isActive?: boolean;
}
