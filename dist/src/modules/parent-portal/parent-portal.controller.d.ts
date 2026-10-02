import { Response } from 'express';
import { RequestUser } from '../auth/types';
import { ParentPortalService } from './parent-portal.service';
import { CreateCoachFeedbackDto } from './dto/coach-feedback.dto';
export declare class ParentPortalController {
    private readonly parentPortalService;
    constructor(parentPortalService: ParentPortalService);
    listChildren(user: RequestUser): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PlayerStatus;
        firstName: string;
        lastName: string;
        playerCode: string | null;
        dateOfBirth: Date;
        photoDocumentId: string | null;
        ageCategory: {
            id: string;
            name: string;
        } | null;
        team: {
            id: string;
            name: string;
        } | null;
    }[]>;
    getPlayerOfTheWeekAwards(user: RequestUser): Promise<({
        team: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        academyId: string;
        playerId: string;
        teamId: string;
        trainingSessionId: string;
        weekOf: Date;
        averageRating: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    getChild(playerId: string, user: RequestUser): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PlayerStatus;
        firstName: string;
        lastName: string;
        playerCode: string | null;
        dateOfBirth: Date;
        photoDocumentId: string | null;
        ageCategory: {
            id: string;
            name: string;
        } | null;
        team: {
            id: string;
            name: string;
        } | null;
    }>;
    getPhoto(playerId: string, user: RequestUser, res: Response): Promise<void>;
    getAttendance(playerId: string, user: RequestUser): Promise<({
        trainingSession: {
            team: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                ageCategoryId: string;
                branchId: string | null;
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
            trainingPlanId: string | null;
            conductedByCoachId: string | null;
            date: Date;
            startTime: string | null;
            endTime: string | null;
            location: string | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        academyId: string;
        playerId: string;
        trainingSessionId: string;
        remarks: string | null;
        recordedByUserId: string;
        recordedAt: Date;
    })[]>;
    getAssessments(playerId: string, user: RequestUser): Promise<({
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
        ratings: ({
            criteria: {
                id: string;
                name: string;
                academyId: string;
                description: string | null;
                sortOrder: number;
                category: import(".prisma/client").$Enums.AssessmentCategory;
                templateId: string;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        academyId: string;
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
    getActivityMarks(playerId: string, user: RequestUser): Promise<({
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
        remarks: string | null;
        trainingActivityId: string;
        ratedByCoachId: string;
        rating: number;
    })[]>;
    getCoaches(playerId: string, user: RequestUser): Promise<{
        id: string;
        firstName: string;
        lastName: string;
    }[]>;
    getMatches(playerId: string, user: RequestUser): Promise<({
        match: {
            team: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                ageCategoryId: string;
                branchId: string | null;
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
            matchDate: Date;
            opponentId: string;
            competitionName: string | null;
            venue: string | null;
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
    getFinanceSummary(playerId: string, user: RequestUser): Promise<{
        totalDue: number;
        paidToDate: number;
        nextDueDate: Date | null;
        status: string;
    }>;
    getStatement(playerId: string, user: RequestUser): Promise<{
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
    submitFeedback(playerId: string, dto: CreateCoachFeedbackDto, user: RequestUser): Promise<{
        criteria: {
            id: string;
            academyId: string;
            rating: import("@prisma/client/runtime/library").Decimal;
            criterionName: string;
            feedbackId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        academyId: string;
        submittedByUserId: string;
        playerId: string;
        coachId: string;
        period: string | null;
        overallRating: import("@prisma/client/runtime/library").Decimal;
        isAnonymous: boolean;
        comments: string | null;
    }>;
}
