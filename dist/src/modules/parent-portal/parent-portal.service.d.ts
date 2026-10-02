import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { StorageService } from '../storage/storage.service';
import { CreateCoachFeedbackDto } from './dto/coach-feedback.dto';
export declare class ParentPortalService {
    private readonly prisma;
    private readonly guardianContext;
    private readonly storage;
    private readonly tenantContext;
    constructor(prisma: PrismaService, guardianContext: GuardianContextService, storage: StorageService, tenantContext: TenantContextService);
    listChildren(userId: string): Promise<{
        ageCategory: {
            id: string;
            name: string;
        } | null;
        team: {
            id: string;
            name: string;
        } | null;
        id: string;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.PlayerStatus;
        playerCode: string | null;
        dateOfBirth: Date;
        photoDocumentId: string | null;
    }[]>;
    getPlayerOfTheWeekAwards(userId: string): Promise<({
        team: {
            name: string;
        };
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        teamId: string;
        playerId: string;
        trainingSessionId: string;
        weekOf: Date;
        averageRating: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    private assertAccess;
    getChild(userId: string, playerId: string): Promise<{
        ageCategory: {
            id: string;
            name: string;
        } | null;
        team: {
            id: string;
            name: string;
        } | null;
        id: string;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.PlayerStatus;
        playerCode: string | null;
        dateOfBirth: Date;
        photoDocumentId: string | null;
    }>;
    getPhoto(userId: string, playerId: string): Promise<{
        buffer: Buffer;
        mimeType: string;
    }>;
    getCoaches(userId: string, playerId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
    }[]>;
    getAttendance(userId: string, playerId: string): Promise<({
        trainingSession: {
            team: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                branchId: string | null;
                isActive: boolean;
                ageCategoryId: string;
                seasonId: string;
                headCoachId: string | null;
            };
        } & {
            id: string;
            academyId: string;
            status: import(".prisma/client").$Enums.TrainingSessionStatus;
            createdAt: Date;
            updatedAt: Date;
            startTime: string | null;
            endTime: string | null;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            trainingPlanId: string | null;
            conductedByCoachId: string | null;
            date: Date;
        };
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        playerId: string;
        remarks: string | null;
        trainingSessionId: string;
        recordedByUserId: string;
        recordedAt: Date;
    })[]>;
    getAssessments(userId: string, playerId: string): Promise<({
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
    getActivityMarks(userId: string, playerId: string): Promise<({
        trainingActivity: {
            trainingPlan: {
                title: string;
                scheduledDate: Date;
            };
            name: string;
        };
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        playerId: string;
        trainingActivityId: string;
        ratedByCoachId: string;
        rating: number;
        remarks: string | null;
    })[]>;
    getMatches(userId: string, playerId: string): Promise<({
        match: {
            team: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                branchId: string | null;
                isActive: boolean;
                ageCategoryId: string;
                seasonId: string;
                headCoachId: string | null;
            };
            opponent: {
                id: string;
                academyId: string;
                createdAt: Date;
                name: string;
                contactInfo: string | null;
            };
        } & {
            id: string;
            academyId: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            opponentId: string;
            competitionName: string | null;
            venue: string | null;
            matchDate: Date;
            homeScore: number | null;
            awayScore: number | null;
            notes: string | null;
        };
    } & {
        id: string;
        academyId: string;
        playerId: string;
        matchId: string;
        isStarting: boolean;
        isSubstitute: boolean;
        positionPlayed: string | null;
        minutesPlayed: number | null;
    })[]>;
    getFinanceSummary(userId: string, playerId: string): Promise<{
        totalDue: number;
        paidToDate: number;
        nextDueDate: Date | null;
        status: string;
    }>;
    getStatement(userId: string, playerId: string): Promise<{
        invoices: {
            id: string;
            invoiceNumber: string;
            issuedAt: Date;
            dueDate: Date;
            amount: number;
            discountAmount: number;
            remaining: number;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            feeTypeName: string;
        }[];
        payments: {
            paymentId: string;
            invoiceId: string;
            receiptNumber: string;
            paidAt: Date;
            method: import(".prisma/client").$Enums.PaymentMethod;
            amount: number;
            feeTypeName: string;
            invoiceNumber: string;
        }[];
    }>;
    submitFeedback(userId: string, playerId: string, dto: CreateCoachFeedbackDto): Promise<{
        criteria: {
            id: string;
            academyId: string;
            rating: import("@prisma/client/runtime/library").Decimal;
            feedbackId: string;
            criterionName: string;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        playerId: string;
        coachId: string;
        submittedByUserId: string;
        comments: string | null;
        overallRating: import("@prisma/client/runtime/library").Decimal;
        period: string | null;
        isAnonymous: boolean;
    }>;
}
