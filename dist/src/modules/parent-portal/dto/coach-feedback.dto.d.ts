export declare class CoachFeedbackCriterionInputDto {
    criterionName: string;
    rating: number;
}
export declare class CreateCoachFeedbackDto {
    coachId: string;
    period?: string;
    overallRating: number;
    isAnonymous?: boolean;
    comments?: string;
    criteria?: CoachFeedbackCriterionInputDto[];
}
