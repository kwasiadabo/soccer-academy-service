import { PrismaService } from '../prisma/prisma.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { StorageService } from '../storage/storage.service';
import { CreateCoachFeedbackDto } from './dto/coach-feedback.dto';
export declare class ParentPortalService {
    private readonly prisma;
    private readonly guardianContext;
    private readonly storage;
    constructor(prisma: PrismaService, guardianContext: GuardianContextService, storage: StorageService);
    listChildren(userId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PlayerStatus;
        firstName: string;
        lastName: string;
        ageCategory: {
            id: string;
            name: string;
        } | null;
        team: {
            id: string;
            name: string;
        } | null;
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
        createdAt: Date;
        academyId: string;
        teamId: string;
        playerId: string;
        trainingSessionId: string;
        weekOf: Date;
        averageRating: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    private assertAccess;
    getChild(userId: string, playerId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PlayerStatus;
        firstName: string;
        lastName: string;
        ageCategory: {
            id: string;
            name: string;
        } | null;
        team: {
            id: string;
            name: string;
        } | null;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                branchId: string | null;
                isActive: boolean;
                ageCategoryId: string;
                seasonId: string;
                headCoachId: string | null;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.TrainingSessionStatus;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            teamId: string;
            trainingGroupId: string | null;
            location: string | null;
            trainingPlanId: string | null;
            conductedByCoachId: string | null;
            date: Date;
            startTime: string | null;
            endTime: string | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        academyId: string;
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
            ratingValue: import("@prisma/client/runtime/library").Decimal;
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
    getActivityMarks(userId: string, playerId: string): Promise<({
        trainingActivity: {
            name: string;
            trainingPlan: {
                title: string;
                scheduledDate: Date;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                branchId: string | null;
                isActive: boolean;
                ageCategoryId: string;
                seasonId: string;
                headCoachId: string | null;
            };
            opponent: {
                id: string;
                name: string;
                createdAt: Date;
                academyId: string;
                contactInfo: string | null;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.MatchStatus;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
        createdAt: Date;
        academyId: string;
        playerId: string;
        coachId: string;
        submittedByUserId: string;
        comments: string | null;
        overallRating: import("@prisma/client/runtime/library").Decimal;
        period: string | null;
        isAnonymous: boolean;
    }>;
}
