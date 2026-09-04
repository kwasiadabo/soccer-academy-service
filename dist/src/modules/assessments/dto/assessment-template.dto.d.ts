import { AssessmentCategory, RatingScaleType } from '@prisma/client';
export declare class CreateAssessmentCriteriaInputDto {
    category: AssessmentCategory;
    name: string;
    description?: string;
    sortOrder?: number;
}
export declare class CreateAssessmentTemplateDto {
    name: string;
    ageCategoryId?: string;
    ratingScale?: RatingScaleType;
    criteria?: CreateAssessmentCriteriaInputDto[];
}
export declare class UpdateAssessmentTemplateDto {
    name?: string;
    ageCategoryId?: string;
    ratingScale?: RatingScaleType;
}
