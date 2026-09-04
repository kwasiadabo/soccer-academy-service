import { AttendanceStatus, TrainingApprovalStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CoachContextService } from '../coaches/coach-context.service';
import { EmailService } from '../messaging/email.service';
import { SmsService } from '../messaging/sms.service';
import { RequestUser } from '../auth/types';
import { CreateTrainingActivityInputDto, CreateTrainingPlanDto, UpdateTrainingPlanDto } from './dto/training-plan.dto';
import { UpdateTrainingActivityDto } from './dto/training-activity.dto';
import { TrainingPlanDecisionDto } from './dto/training-decision.dto';
import { CreateTrainingSessionDto, RecordAttendanceDto, UpdateTrainingSessionDto } from './dto/training-session.dto';
import { UpsertActivityMarksDto } from './dto/training-activity-mark.dto';
import { CreateSessionActivityDto } from './dto/training-session-activity.dto';
export declare class TrainingService {
    private readonly prisma;
    private readonly coachContext;
    private readonly email;
    private readonly sms;
    private readonly logger;
    constructor(prisma: PrismaService, coachContext: CoachContextService, email: EmailService, sms: SmsService);
    private canApprove;
    listTeamsForPicker(user: RequestUser): Promise<{
        id: string;
        name: string;
    }[]>;
    private getPlanOrThrow;
    private assertEditable;
    findAllPlans(user: RequestUser, status?: TrainingApprovalStatus): Promise<({
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        }[];
        approvals: {
            id: string;
            submittedByUserId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
            trainingPlanId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        title: string;
        teamId: string;
        coachId: string;
        trainingGroupId: string | null;
        version: number;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
    })[]>;
    findOnePlan(id: string, user: RequestUser): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        }[];
        approvals: {
            id: string;
            submittedByUserId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
            trainingPlanId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        title: string;
        teamId: string;
        coachId: string;
        trainingGroupId: string | null;
        version: number;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
    }>;
    createPlan(userId: string, dto: CreateTrainingPlanDto): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        }[];
        approvals: {
            id: string;
            submittedByUserId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
            trainingPlanId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        title: string;
        teamId: string;
        coachId: string;
        trainingGroupId: string | null;
        version: number;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
    }>;
    private assertOwnPlan;
    updatePlan(id: string, userId: string, dto: UpdateTrainingPlanDto): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        }[];
        approvals: {
            id: string;
            submittedByUserId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
            trainingPlanId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        title: string;
        teamId: string;
        coachId: string;
        trainingGroupId: string | null;
        version: number;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
    }>;
    addActivity(planId: string, userId: string, dto: CreateTrainingActivityInputDto): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        }[];
        approvals: {
            id: string;
            submittedByUserId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
            trainingPlanId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        title: string;
        teamId: string;
        coachId: string;
        trainingGroupId: string | null;
        version: number;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
    }>;
    updateActivity(planId: string, activityId: string, userId: string, dto: UpdateTrainingActivityDto): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        }[];
        approvals: {
            id: string;
            submittedByUserId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
            trainingPlanId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        title: string;
        teamId: string;
        coachId: string;
        trainingGroupId: string | null;
        version: number;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
    }>;
    removeActivity(planId: string, activityId: string, userId: string): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        }[];
        approvals: {
            id: string;
            submittedByUserId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
            trainingPlanId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        title: string;
        teamId: string;
        coachId: string;
        trainingGroupId: string | null;
        version: number;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
    }>;
    private getActivityOrThrow;
    private assertMarksAccess;
    getActivityMarks(activityId: string, user: RequestUser): Promise<{
        activity: {
            trainingPlan: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                assessmentCriteria: string | null;
                title: string;
                teamId: string;
                coachId: string;
                trainingGroupId: string | null;
                version: number;
                objectives: string | null;
                scheduledDate: Date;
                scheduledStart: string | null;
                scheduledEnd: string | null;
                location: string | null;
                requiredEquipment: string | null;
                skillsFocus: string | null;
                approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            };
        } & {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        };
        roster: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
            photoDocumentId: string | null;
        }[];
        marks: ({
            ratedByCoach: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            remarks: string | null;
            playerId: string;
            rating: number;
            trainingActivityId: string;
            ratedByCoachId: string;
        })[];
    }>;
    upsertActivityMarks(activityId: string, user: RequestUser, dto: UpsertActivityMarksDto): Promise<{
        activity: {
            trainingPlan: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                assessmentCriteria: string | null;
                title: string;
                teamId: string;
                coachId: string;
                trainingGroupId: string | null;
                version: number;
                objectives: string | null;
                scheduledDate: Date;
                scheduledStart: string | null;
                scheduledEnd: string | null;
                location: string | null;
                requiredEquipment: string | null;
                skillsFocus: string | null;
                approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            };
        } & {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        };
        roster: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
            photoDocumentId: string | null;
        }[];
        marks: ({
            ratedByCoach: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            remarks: string | null;
            playerId: string;
            rating: number;
            trainingActivityId: string;
            ratedByCoachId: string;
        })[];
    }>;
    getPlayerMarks(playerId: string, user: RequestUser): Promise<({
        trainingActivity: {
            trainingPlan: {
                title: string;
                scheduledDate: Date;
            };
        } & {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        };
        ratedByCoach: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        playerId: string;
        rating: number;
        trainingActivityId: string;
        ratedByCoachId: string;
    })[]>;
    getTeamMarks(teamId: string, user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        player: {
            firstName: string;
            lastName: string;
        };
        playerId: string;
        rating: number;
        trainingActivityId: string;
    }[]>;
    submit(id: string, userId: string): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        }[];
        approvals: {
            id: string;
            submittedByUserId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
            trainingPlanId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        title: string;
        teamId: string;
        coachId: string;
        trainingGroupId: string | null;
        version: number;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
    }>;
    decide(id: string, reviewerUserId: string, dto: TrainingPlanDecisionDto): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            description: string | null;
            name: string;
            sortOrder: number;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
            trainingPlanId: string;
        }[];
        approvals: {
            id: string;
            submittedByUserId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
            trainingPlanId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        title: string;
        teamId: string;
        coachId: string;
        trainingGroupId: string | null;
        version: number;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
    }>;
    private getSessionOrThrow;
    private assertOwnSession;
    private rosterFor;
    private ensureTodaysSaturdaySessions;
    findAllSessions(user: RequestUser): Promise<({
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        trainingPlan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentCriteria: string | null;
            title: string;
            teamId: string;
            coachId: string;
            trainingGroupId: string | null;
            version: number;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
        attendance: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
                playerCode: string | null;
                photoDocumentId: string | null;
            };
            recordedByUser: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            remarks: string | null;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            createdAt: Date;
            name: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        teamId: string;
        trainingGroupId: string | null;
        date: Date;
        location: string | null;
        trainingPlanId: string | null;
        startTime: string | null;
        endTime: string | null;
        conductedByCoachId: string | null;
    })[]>;
    findOneSession(id: string): Promise<{
        roster: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
            photoDocumentId: string | null;
        }[];
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        trainingPlan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentCriteria: string | null;
            title: string;
            teamId: string;
            coachId: string;
            trainingGroupId: string | null;
            version: number;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
        attendance: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
                playerCode: string | null;
                photoDocumentId: string | null;
            };
            recordedByUser: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            remarks: string | null;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            createdAt: Date;
            name: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        teamId: string;
        trainingGroupId: string | null;
        date: Date;
        location: string | null;
        trainingPlanId: string | null;
        startTime: string | null;
        endTime: string | null;
        conductedByCoachId: string | null;
    }>;
    createSession(userId: string, dto: CreateTrainingSessionDto): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        trainingPlan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentCriteria: string | null;
            title: string;
            teamId: string;
            coachId: string;
            trainingGroupId: string | null;
            version: number;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
        attendance: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
                playerCode: string | null;
                photoDocumentId: string | null;
            };
            recordedByUser: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            remarks: string | null;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            createdAt: Date;
            name: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        teamId: string;
        trainingGroupId: string | null;
        date: Date;
        location: string | null;
        trainingPlanId: string | null;
        startTime: string | null;
        endTime: string | null;
        conductedByCoachId: string | null;
    }>;
    updateSession(id: string, userId: string, dto: UpdateTrainingSessionDto): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        trainingPlan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentCriteria: string | null;
            title: string;
            teamId: string;
            coachId: string;
            trainingGroupId: string | null;
            version: number;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
        attendance: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
                playerCode: string | null;
                photoDocumentId: string | null;
            };
            recordedByUser: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            remarks: string | null;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            createdAt: Date;
            name: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        teamId: string;
        trainingGroupId: string | null;
        date: Date;
        location: string | null;
        trainingPlanId: string | null;
        startTime: string | null;
        endTime: string | null;
        conductedByCoachId: string | null;
    }>;
    private resolveSaturday;
    private getOrCreateSaturdaySessionRecord;
    getOrCreateSaturdaySession(teamId: string, dateStr?: string): Promise<{
        roster: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
            photoDocumentId: string | null;
        }[];
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        trainingPlan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentCriteria: string | null;
            title: string;
            teamId: string;
            coachId: string;
            trainingGroupId: string | null;
            version: number;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
        attendance: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
                playerCode: string | null;
                photoDocumentId: string | null;
            };
            recordedByUser: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            remarks: string | null;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            createdAt: Date;
            name: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        teamId: string;
        trainingGroupId: string | null;
        date: Date;
        location: string | null;
        trainingPlanId: string | null;
        startTime: string | null;
        endTime: string | null;
        conductedByCoachId: string | null;
    }>;
    handleSaturdaySessionsCron(): Promise<void>;
    provisionSaturdaySessions(): Promise<{
        created: number;
        skipped: number;
    }>;
    private alertCoachesOfSaturdaySession;
    quickMarkAttendance(playerId: string, user: RequestUser, status?: AttendanceStatus): Promise<{
        player: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
        };
        trainingSession: {
            team: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TrainingSessionStatus;
            teamId: string;
            trainingGroupId: string | null;
            date: Date;
            location: string | null;
            trainingPlanId: string | null;
            startTime: string | null;
            endTime: string | null;
            conductedByCoachId: string | null;
        };
        recordedByUser: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        remarks: string | null;
        playerId: string;
        trainingSessionId: string;
        recordedByUserId: string;
        recordedAt: Date;
    }>;
    recordAttendance(id: string, user: RequestUser, dto: RecordAttendanceDto): Promise<{
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        trainingPlan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentCriteria: string | null;
            title: string;
            teamId: string;
            coachId: string;
            trainingGroupId: string | null;
            version: number;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
        attendance: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
                playerCode: string | null;
                photoDocumentId: string | null;
            };
            recordedByUser: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            remarks: string | null;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            createdAt: Date;
            name: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        teamId: string;
        trainingGroupId: string | null;
        date: Date;
        location: string | null;
        trainingPlanId: string | null;
        startTime: string | null;
        endTime: string | null;
        conductedByCoachId: string | null;
    }>;
    private assertCanManageSession;
    addSessionActivity(sessionId: string, user: RequestUser, dto: CreateSessionActivityDto): Promise<{
        roster: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
            photoDocumentId: string | null;
        }[];
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        trainingPlan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentCriteria: string | null;
            title: string;
            teamId: string;
            coachId: string;
            trainingGroupId: string | null;
            version: number;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
        attendance: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
                playerCode: string | null;
                photoDocumentId: string | null;
            };
            recordedByUser: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            remarks: string | null;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            createdAt: Date;
            name: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        teamId: string;
        trainingGroupId: string | null;
        date: Date;
        location: string | null;
        trainingPlanId: string | null;
        startTime: string | null;
        endTime: string | null;
        conductedByCoachId: string | null;
    }>;
    removeSessionActivity(sessionId: string, activityId: string, user: RequestUser): Promise<{
        roster: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
            photoDocumentId: string | null;
        }[];
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        trainingGroup: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        trainingPlan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentCriteria: string | null;
            title: string;
            teamId: string;
            coachId: string;
            trainingGroupId: string | null;
            version: number;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
        attendance: ({
            player: {
                id: string;
                firstName: string;
                lastName: string;
                playerCode: string | null;
                photoDocumentId: string | null;
            };
            recordedByUser: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            remarks: string | null;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            createdAt: Date;
            name: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        teamId: string;
        trainingGroupId: string | null;
        date: Date;
        location: string | null;
        trainingPlanId: string | null;
        startTime: string | null;
        endTime: string | null;
        conductedByCoachId: string | null;
    }>;
}
