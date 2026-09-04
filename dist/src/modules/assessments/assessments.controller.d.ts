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
            description: string | null;
            name: string;
            sortOrder: number;
            category: import(".prisma/client").$Enums.AssessmentCategory;
            templateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    })[]>;
    findAllOversight(teamId?: string, trainingSessionId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        player: {
            id: string;
            firstName: string;
            lastName: string;
            team: {
                id: string;
                name: string;
            } | null;
        };
        ratings: ({
            criteria: {
                id: string;
                description: string | null;
                name: string;
                sortOrder: number;
                category: import(".prisma/client").$Enums.AssessmentCategory;
                templateId: string;
            } | null;
            sessionActivity: {
                id: string;
                createdAt: Date;
                name: string;
                sortOrder: number;
                trainingSessionId: string;
            } | null;
        } & {
            id: string;
            remarks: string | null;
            criteriaId: string | null;
            sessionActivityId: string | null;
            ratingValue: import("@prisma/client/runtime/library").Decimal;
            ratingLabel: string | null;
            playerAssessmentId: string;
        })[];
        template: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        playerId: string;
        trainingSessionId: string | null;
        templateId: string | null;
        matchId: string | null;
        strengths: string | null;
        areasForImprovement: string | null;
        developmentGoals: string | null;
        assessedByCoachId: string;
        assessmentDate: Date;
    })[]>;
    createTemplate(dto: CreateAssessmentTemplateDto): Promise<{
        criteria: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            category: import(".prisma/client").$Enums.AssessmentCategory;
            templateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    }>;
    updateTemplate(id: string, dto: UpdateAssessmentTemplateDto): Promise<{
        criteria: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            category: import(".prisma/client").$Enums.AssessmentCategory;
            templateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    }>;
    addCriteria(id: string, dto: CreateAssessmentCriteriaInputDto): Promise<{
        criteria: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            category: import(".prisma/client").$Enums.AssessmentCategory;
            templateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    }>;
    findForPlayer(playerId: string, user: RequestUser): Promise<({
        ratings: ({
            criteria: {
                id: string;
                description: string | null;
                name: string;
                sortOrder: number;
                category: import(".prisma/client").$Enums.AssessmentCategory;
                templateId: string;
            } | null;
            sessionActivity: {
                id: string;
                createdAt: Date;
                name: string;
                sortOrder: number;
                trainingSessionId: string;
            } | null;
        } & {
            id: string;
            remarks: string | null;
            criteriaId: string | null;
            sessionActivityId: string | null;
            ratingValue: import("@prisma/client/runtime/library").Decimal;
            ratingLabel: string | null;
            playerAssessmentId: string;
        })[];
        template: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        playerId: string;
        trainingSessionId: string | null;
        templateId: string | null;
        matchId: string | null;
        strengths: string | null;
        areasForImprovement: string | null;
        developmentGoals: string | null;
        assessedByCoachId: string;
        assessmentDate: Date;
    })[]>;
    createAssessment(playerId: string, dto: CreatePlayerAssessmentDto, user: RequestUser): Promise<{
        ratings: ({
            criteria: {
                id: string;
                description: string | null;
                name: string;
                sortOrder: number;
                category: import(".prisma/client").$Enums.AssessmentCategory;
                templateId: string;
            } | null;
            sessionActivity: {
                id: string;
                createdAt: Date;
                name: string;
                sortOrder: number;
                trainingSessionId: string;
            } | null;
        } & {
            id: string;
            remarks: string | null;
            criteriaId: string | null;
            sessionActivityId: string | null;
            ratingValue: import("@prisma/client/runtime/library").Decimal;
            ratingLabel: string | null;
            playerAssessmentId: string;
        })[];
        template: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        playerId: string;
        trainingSessionId: string | null;
        templateId: string | null;
        matchId: string | null;
        strengths: string | null;
        areasForImprovement: string | null;
        developmentGoals: string | null;
        assessedByCoachId: string;
        assessmentDate: Date;
    }>;
    updateAssessment(playerId: string, assessmentId: string, dto: UpdatePlayerAssessmentDto, user: RequestUser): Promise<{
        ratings: ({
            criteria: {
                id: string;
                description: string | null;
                name: string;
                sortOrder: number;
                category: import(".prisma/client").$Enums.AssessmentCategory;
                templateId: string;
            } | null;
            sessionActivity: {
                id: string;
                createdAt: Date;
                name: string;
                sortOrder: number;
                trainingSessionId: string;
            } | null;
        } & {
            id: string;
            remarks: string | null;
            criteriaId: string | null;
            sessionActivityId: string | null;
            ratingValue: import("@prisma/client/runtime/library").Decimal;
            ratingLabel: string | null;
            playerAssessmentId: string;
        })[];
        template: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
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
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        playerId: string;
        trainingSessionId: string | null;
        templateId: string | null;
        matchId: string | null;
        strengths: string | null;
        areasForImprovement: string | null;
        developmentGoals: string | null;
        assessedByCoachId: string;
        assessmentDate: Date;
    }>;
    findRemarks(playerId: string, user: RequestUser): Promise<({
        coach: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        context: string | null;
        coachId: string;
        playerId: string;
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
        createdAt: Date;
        context: string | null;
        coachId: string;
        playerId: string;
        remark: string;
    }>;
}
