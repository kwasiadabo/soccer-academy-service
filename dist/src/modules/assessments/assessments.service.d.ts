import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CoachContextService } from '../coaches/coach-context.service';
import { RequestUser } from '../auth/types';
import { CreateAssessmentCriteriaInputDto, CreateAssessmentTemplateDto, UpdateAssessmentTemplateDto } from './dto/assessment-template.dto';
import { CreatePlayerAssessmentDto, UpdatePlayerAssessmentDto } from './dto/player-assessment.dto';
import { CreateCoachRemarkDto } from './dto/coach-remark.dto';
export declare class AssessmentsService {
    private readonly prisma;
    private readonly coachContext;
    private readonly tenantContext;
    constructor(prisma: PrismaService, coachContext: CoachContextService, tenantContext: TenantContextService);
    private canViewAll;
    findAllTemplates(): Prisma.PrismaPromise<({
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
    addCriteria(templateId: string, dto: CreateAssessmentCriteriaInputDto): Promise<{
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
    private getTemplateOrThrow;
    findAllOversight(teamId?: string, trainingSessionId?: string): Prisma.PrismaPromise<({
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
            ratingValue: Prisma.Decimal;
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
            ratingValue: Prisma.Decimal;
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
    private assertValidRatings;
    private assertPlayerIsActive;
    private assertCanAssessPlayer;
    createAssessment(playerId: string, userId: string, dto: CreatePlayerAssessmentDto): Promise<{
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
            ratingValue: Prisma.Decimal;
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
    updateAssessment(playerId: string, assessmentId: string, userId: string, dto: UpdatePlayerAssessmentDto): Promise<{
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
            ratingValue: Prisma.Decimal;
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
    findRemarksForPlayer(playerId: string, user: RequestUser): Promise<({
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
    createRemark(playerId: string, userId: string, dto: CreateCoachRemarkDto): Promise<{
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
