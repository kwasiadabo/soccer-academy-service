export declare class CreateAssessmentRatingInputDto {
    criteriaId?: string;
    sessionActivityId?: string;
    ratingValue: number;
    ratingLabel?: string;
    remarks?: string;
}
export declare class CreatePlayerAssessmentDto {
    templateId?: string;
    trainingSessionId?: string;
    matchId?: string;
    strengths?: string;
    areasForImprovement?: string;
    developmentGoals?: string;
    ratings: CreateAssessmentRatingInputDto[];
}
export declare class UpdatePlayerAssessmentDto {
    strengths?: string;
    areasForImprovement?: string;
    developmentGoals?: string;
    ratings: CreateAssessmentRatingInputDto[];
}
