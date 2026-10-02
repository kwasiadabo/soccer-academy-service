import { RequestUser } from '../auth/types';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentCriteriaInputDto, CreateAssessmentTemplateDto, UpdateAssessmentTemplateDto } from './dto/assessment-template.dto';
import { CreatePlayerAssessmentDto, UpdatePlayerAssessmentDto } from './dto/player-assessment.dto';
import { CreateCoachRemarkDto } from './dto/coach-remark.dto';
export declare class AssessmentsController {
    private readonly assessmentsService;
    constructor(assessmentsService: AssessmentsService);
    findAllTemplates(): import(".prisma/client").Prisma.PrismaPromise<({
        criteria: {
            id: string;
            academyId: string;
            name: string;
            description: string | null;
            sortOrder: number;
            templateId: string;
            category: import(".prisma/client").$Enums.AssessmentCategory;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    })[]>;
    findAllOversight(teamId?: string, trainingSessionId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        player: {
            team: {
                id: string;
                name: string;
            } | null;
            id: string;
            firstName: string;
            lastName: string;
        };
        ratings: ({
            criteria: {
                id: string;
                academyId: string;
                name: string;
                description: string | null;
                sortOrder: number;
                templateId: string;
                category: import(".prisma/client").$Enums.AssessmentCategory;
            } | null;
            sessionActivity: {
                id: string;
                academyId: string;
                createdAt: Date;
                name: string;
                sortOrder: number;
                trainingSessionId: string;
            } | null;
        } & {
            id: string;
            academyId: string;
            remarks: string | null;
            playerAssessmentId: string;
            criteriaId: string | null;
            sessionActivityId: string | null;
            ratingValue: import("@prisma/client/runtime/library").Decimal;
            ratingLabel: string | null;
        })[];
        template: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            ageCategoryId: string | null;
            ratingScale: import(".prisma/client").$Enums.RatingScaleType;
        } | null;
        assessedByCoach: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        playerId: string;
        trainingSessionId: string | null;
        templateId: string | null;
        matchId: string | null;
        assessedByCoachId: string;
        assessmentDate: Date;
        strengths: string | null;
        areasForImprovement: string | null;
        developmentGoals: string | null;
    })[]>;
    createTemplate(dto: CreateAssessmentTemplateDto): Promise<{
        criteria: {
            id: string;
            academyId: string;
            name: string;
            description: string | null;
            sortOrder: number;
            templateId: string;
            category: import(".prisma/client").$Enums.AssessmentCategory;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    }>;
    updateTemplate(id: string, dto: UpdateAssessmentTemplateDto): Promise<{
        criteria: {
            id: string;
            academyId: string;
            name: string;
            description: string | null;
            sortOrder: number;
            templateId: string;
            category: import(".prisma/client").$Enums.AssessmentCategory;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    }>;
    addCriteria(id: string, dto: CreateAssessmentCriteriaInputDto): Promise<{
        criteria: {
            id: string;
            academyId: string;
            name: string;
            description: string | null;
            sortOrder: number;
            templateId: string;
            category: import(".prisma/client").$Enums.AssessmentCategory;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    }>;
    findForPlayer(playerId: string, user: RequestUser): Promise<({
        ratings: ({
            criteria: {
                id: string;
                academyId: string;
                name: string;
                description: string | null;
                sortOrder: number;
                templateId: string;
                category: import(".prisma/client").$Enums.AssessmentCategory;
            } | null;
            sessionActivity: {
                id: string;
                academyId: string;
                createdAt: Date;
                name: string;
                sortOrder: number;
                trainingSessionId: string;
            } | null;
        } & {
            id: string;
            academyId: string;
            remarks: string | null;
            playerAssessmentId: string;
            criteriaId: string | null;
            sessionActivityId: string | null;
            ratingValue: import("@prisma/client/runtime/library").Decimal;
            ratingLabel: string | null;
        })[];
        template: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            ageCategoryId: string | null;
            ratingScale: import(".prisma/client").$Enums.RatingScaleType;
        } | null;
        assessedByCoach: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        playerId: string;
        trainingSessionId: string | null;
        templateId: string | null;
        matchId: string | null;
        assessedByCoachId: string;
        assessmentDate: Date;
        strengths: string | null;
        areasForImprovement: string | null;
        developmentGoals: string | null;
    })[]>;
    createAssessment(playerId: string, dto: CreatePlayerAssessmentDto, user: RequestUser): Promise<{
        ratings: ({
            criteria: {
                id: string;
                academyId: string;
                name: string;
                description: string | null;
                sortOrder: number;
                templateId: string;
                category: import(".prisma/client").$Enums.AssessmentCategory;
            } | null;
            sessionActivity: {
                id: string;
                academyId: string;
                createdAt: Date;
                name: string;
                sortOrder: number;
                trainingSessionId: string;
            } | null;
        } & {
            id: string;
            academyId: string;
            remarks: string | null;
            playerAssessmentId: string;
            criteriaId: string | null;
            sessionActivityId: string | null;
            ratingValue: import("@prisma/client/runtime/library").Decimal;
            ratingLabel: string | null;
        })[];
        template: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            ageCategoryId: string | null;
            ratingScale: import(".prisma/client").$Enums.RatingScaleType;
        } | null;
        assessedByCoach: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        playerId: string;
        trainingSessionId: string | null;
        templateId: string | null;
        matchId: string | null;
        assessedByCoachId: string;
        assessmentDate: Date;
        strengths: string | null;
        areasForImprovement: string | null;
        developmentGoals: string | null;
    }>;
    updateAssessment(playerId: string, assessmentId: string, dto: UpdatePlayerAssessmentDto, user: RequestUser): Promise<{
        ratings: ({
            criteria: {
                id: string;
                academyId: string;
                name: string;
                description: string | null;
                sortOrder: number;
                templateId: string;
                category: import(".prisma/client").$Enums.AssessmentCategory;
            } | null;
            sessionActivity: {
                id: string;
                academyId: string;
                createdAt: Date;
                name: string;
                sortOrder: number;
                trainingSessionId: string;
            } | null;
        } & {
            id: string;
            academyId: string;
            remarks: string | null;
            playerAssessmentId: string;
            criteriaId: string | null;
            sessionActivityId: string | null;
            ratingValue: import("@prisma/client/runtime/library").Decimal;
            ratingLabel: string | null;
        })[];
        template: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            ageCategoryId: string | null;
            ratingScale: import(".prisma/client").$Enums.RatingScaleType;
        } | null;
        assessedByCoach: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        playerId: string;
        trainingSessionId: string | null;
        templateId: string | null;
        matchId: string | null;
        assessedByCoachId: string;
        assessmentDate: Date;
        strengths: string | null;
        areasForImprovement: string | null;
        developmentGoals: string | null;
    }>;
    findRemarks(playerId: string, user: RequestUser): Promise<({
        coach: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        playerId: string;
        coachId: string;
        context: string | null;
        remark: string;
    })[]>;
    createRemark(playerId: string, dto: CreateCoachRemarkDto, user: RequestUser): Promise<{
        coach: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        playerId: string;
        coachId: string;
        context: string | null;
        remark: string;
    }>;
}
