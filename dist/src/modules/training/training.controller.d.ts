import { TrainingApprovalStatus } from '@prisma/client';
import { RequestUser } from '../auth/types';
import { TrainingService } from './training.service';
import { CreateTrainingActivityInputDto, CreateTrainingPlanDto, UpdateTrainingPlanDto } from './dto/training-plan.dto';
import { UpdateTrainingActivityDto } from './dto/training-activity.dto';
import { TrainingPlanDecisionDto } from './dto/training-decision.dto';
import { CreateTrainingSessionDto, GetOrCreateSaturdaySessionDto, QuickMarkAttendanceDto, RecordAttendanceDto, UpdateTrainingSessionDto } from './dto/training-session.dto';
import { UpsertActivityMarksDto } from './dto/training-activity-mark.dto';
import { CreateSessionActivityDto } from './dto/training-session-activity.dto';
export declare class TrainingController {
    private readonly trainingService;
    constructor(trainingService: TrainingService);
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
    listTeams(user: RequestUser): Promise<{
        id: string;
        name: string;
    }[]>;
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
    createPlan(dto: CreateTrainingPlanDto, user: RequestUser): Promise<{
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
    updatePlan(id: string, dto: UpdateTrainingPlanDto, user: RequestUser): Promise<{
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
    addActivity(id: string, dto: CreateTrainingActivityInputDto, user: RequestUser): Promise<{
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
    updateActivity(id: string, activityId: string, dto: UpdateTrainingActivityDto, user: RequestUser): Promise<{
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
    removeActivity(id: string, activityId: string, user: RequestUser): Promise<{
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
    submit(id: string, user: RequestUser): Promise<{
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
    decide(id: string, dto: TrainingPlanDecisionDto, user: RequestUser): Promise<{
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
    createSession(dto: CreateTrainingSessionDto, user: RequestUser): Promise<{
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
    getOrCreateSaturdaySession(dto: GetOrCreateSaturdaySessionDto): Promise<{
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
    quickMarkAttendance(dto: QuickMarkAttendanceDto, user: RequestUser): Promise<{
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
    updateSession(id: string, dto: UpdateTrainingSessionDto, user: RequestUser): Promise<{
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
    recordAttendance(id: string, dto: RecordAttendanceDto, user: RequestUser): Promise<{
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
    addSessionActivity(id: string, dto: CreateSessionActivityDto, user: RequestUser): Promise<{
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
    removeSessionActivity(id: string, activityId: string, user: RequestUser): Promise<{
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
    upsertActivityMarks(activityId: string, dto: UpsertActivityMarksDto, user: RequestUser): Promise<{
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
}
