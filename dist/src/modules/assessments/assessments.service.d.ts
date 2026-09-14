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
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            templateId: string;
            category: import(".prisma/client").$Enums.AssessmentCategory;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    })[]>;
    createTemplate(dto: CreateAssessmentTemplateDto): Promise<{
        criteria: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            templateId: string;
            category: import(".prisma/client").$Enums.AssessmentCategory;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    }>;
    updateTemplate(id: string, dto: UpdateAssessmentTemplateDto): Promise<{
        criteria: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            templateId: string;
            category: import(".prisma/client").$Enums.AssessmentCategory;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        ageCategoryId: string | null;
        ratingScale: import(".prisma/client").$Enums.RatingScaleType;
    }>;
    addCriteria(templateId: string, dto: CreateAssessmentCriteriaInputDto): Promise<{
        criteria: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            templateId: string;
            category: import(".prisma/client").$Enums.AssessmentCategory;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
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
                name: string;
                description: string | null;
                academyId: string;
                sortOrder: number;
                templateId: string;
                category: import(".prisma/client").$Enums.AssessmentCategory;
            } | null;
            sessionActivity: {
                id: string;
                name: string;
                createdAt: Date;
                academyId: string;
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
            ratingValue: Prisma.Decimal;
            ratingLabel: string | null;
        })[];
        template: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
        academyId: string;
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
    findForPlayer(playerId: string, user: RequestUser): Promise<({
        ratings: ({
            criteria: {
                id: string;
                name: string;
                description: string | null;
                academyId: string;
                sortOrder: number;
                templateId: string;
                category: import(".prisma/client").$Enums.AssessmentCategory;
            } | null;
            sessionActivity: {
                id: string;
                name: string;
                createdAt: Date;
                academyId: string;
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
            ratingValue: Prisma.Decimal;
            ratingLabel: string | null;
        })[];
        template: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
        academyId: string;
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
    private assertValidRatings;
    private assertPlayerIsActive;
    private assertCanAssessPlayer;
    createAssessment(playerId: string, userId: string, dto: CreatePlayerAssessmentDto): Promise<{
        ratings: ({
            criteria: {
                id: string;
                name: string;
                description: string | null;
                academyId: string;
                sortOrder: number;
                templateId: string;
                category: import(".prisma/client").$Enums.AssessmentCategory;
            } | null;
            sessionActivity: {
                id: string;
                name: string;
                createdAt: Date;
                academyId: string;
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
            ratingValue: Prisma.Decimal;
            ratingLabel: string | null;
        })[];
        template: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
        academyId: string;
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
    updateAssessment(playerId: string, assessmentId: string, userId: string, dto: UpdatePlayerAssessmentDto): Promise<{
        ratings: ({
            criteria: {
                id: string;
                name: string;
                description: string | null;
                academyId: string;
                sortOrder: number;
                templateId: string;
                category: import(".prisma/client").$Enums.AssessmentCategory;
            } | null;
            sessionActivity: {
                id: string;
                name: string;
                createdAt: Date;
                academyId: string;
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
            ratingValue: Prisma.Decimal;
            ratingLabel: string | null;
        })[];
        template: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
        academyId: string;
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
    findRemarksForPlayer(playerId: string, user: RequestUser): Promise<({
        coach: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        academyId: string;
        context: string | null;
        playerId: string;
        coachId: string;
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
        academyId: string;
        context: string | null;
        playerId: string;
        coachId: string;
        remark: string;
    }>;
}
