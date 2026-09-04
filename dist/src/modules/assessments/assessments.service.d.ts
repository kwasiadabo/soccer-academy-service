import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CoachContextService } from '../coaches/coach-context.service';
import { RequestUser } from '../auth/types';
import { CreateAssessmentCriteriaInputDto, CreateAssessmentTemplateDto, UpdateAssessmentTemplateDto } from './dto/assessment-template.dto';
import { CreatePlayerAssessmentDto, UpdatePlayerAssessmentDto } from './dto/player-assessment.dto';
import { CreateCoachRemarkDto } from './dto/coach-remark.dto';
export declare class AssessmentsService {
    private readonly prisma;
    private readonly coachContext;
    constructor(prisma: PrismaService, coachContext: CoachContextService);
    private canViewAll;
    findAllTemplates(): Prisma.PrismaPromise<({
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
    addCriteria(templateId: string, dto: CreateAssessmentCriteriaInputDto): Promise<{
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
    private getTemplateOrThrow;
    findAllOversight(teamId?: string, trainingSessionId?: string): Prisma.PrismaPromise<({
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
            ratingValue: Prisma.Decimal;
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
            ratingValue: Prisma.Decimal;
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
    private assertValidRatings;
    private assertPlayerIsActive;
    private assertCanAssessPlayer;
    createAssessment(playerId: string, userId: string, dto: CreatePlayerAssessmentDto): Promise<{
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
            ratingValue: Prisma.Decimal;
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
    updateAssessment(playerId: string, assessmentId: string, userId: string, dto: UpdatePlayerAssessmentDto): Promise<{
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
            ratingValue: Prisma.Decimal;
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
    findRemarksForPlayer(playerId: string, user: RequestUser): Promise<({
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
    createRemark(playerId: string, userId: string, dto: CreateCoachRemarkDto): Promise<{
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
