export declare class CreateTrainingActivityInputDto {
    name: string;
    description?: string;
    durationMinutes?: number;
    skillsDeveloped?: string;
    sortOrder?: number;
}
export declare class CreateTrainingPlanDto {
    teamId: string;
    trainingGroupId?: string;
    title: string;
    objectives?: string;
    scheduledDate: string;
    scheduledStart?: string;
    scheduledEnd?: string;
    location?: string;
    requiredEquipment?: string;
    skillsFocus?: string;
    assessmentCriteria?: string;
    activities?: CreateTrainingActivityInputDto[];
}
export declare class UpdateTrainingPlanDto {
    title?: string;
    objectives?: string;
    scheduledDate?: string;
    scheduledStart?: string;
    scheduledEnd?: string;
    location?: string;
    requiredEquipment?: string;
    skillsFocus?: string;
    assessmentCriteria?: string;
}
