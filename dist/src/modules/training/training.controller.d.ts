import { TrainingApprovalStatus } from '@prisma/client';
import { RequestUser } from '../auth/types';
import { TrainingService } from './training.service';
import { CreateTrainingActivityInputDto, CreateTrainingPlanDto, UpdateTrainingPlanDto } from './dto/training-plan.dto';
import { UpdateTrainingActivityDto } from './dto/training-activity.dto';
import { TrainingPlanDecisionDto } from './dto/training-decision.dto';
import { CreateTrainingSessionDto, GetOrCreateSaturdaySessionDto, QuickMarkAttendanceDto, RecordAttendanceDto, UpdateTrainingSessionDto } from './dto/training-session.dto';
import { UpsertActivityMarksDto } from './dto/training-activity-mark.dto';
import { CreateSessionActivityDto } from './dto/training-session-activity.dto';
import { CreateTrainingScheduleSlotDto, UpdateTrainingScheduleSlotDto } from './dto/training-schedule.dto';
export declare class TrainingController {
    private readonly trainingService;
    constructor(trainingService: TrainingService);
    findAllPlans(user: RequestUser, status?: TrainingApprovalStatus): Promise<({
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            trainingPlanId: string;
            submittedByUserId: string;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        academyId: string;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    })[]>;
    listTeams(user: RequestUser): Promise<{
        id: string;
        name: string;
    }[]>;
    findOnePlan(id: string, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            trainingPlanId: string;
            submittedByUserId: string;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        academyId: string;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    createPlan(dto: CreateTrainingPlanDto, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            trainingPlanId: string;
            submittedByUserId: string;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        academyId: string;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    updatePlan(id: string, dto: UpdateTrainingPlanDto, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            trainingPlanId: string;
            submittedByUserId: string;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        academyId: string;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    addActivity(id: string, dto: CreateTrainingActivityInputDto, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            trainingPlanId: string;
            submittedByUserId: string;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        academyId: string;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    updateActivity(id: string, activityId: string, dto: UpdateTrainingActivityDto, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            trainingPlanId: string;
            submittedByUserId: string;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        academyId: string;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    removeActivity(id: string, activityId: string, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            trainingPlanId: string;
            submittedByUserId: string;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        academyId: string;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    submit(id: string, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            trainingPlanId: string;
            submittedByUserId: string;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        academyId: string;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    decide(id: string, dto: TrainingPlanDecisionDto, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            branchId: string | null;
            isActive: boolean;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        coach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        };
        activities: {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            trainingPlanId: string;
            submittedByUserId: string;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assessmentCriteria: string | null;
        academyId: string;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    findAllSessions(user: RequestUser): Promise<({
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
            academyId: string;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
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
            academyId: string;
            playerId: string;
            remarks: string | null;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        startTime: string | null;
        endTime: string | null;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
            academyId: string;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
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
            academyId: string;
            playerId: string;
            remarks: string | null;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        startTime: string | null;
        endTime: string | null;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
    }>;
    createSession(dto: CreateTrainingSessionDto, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
            academyId: string;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
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
            academyId: string;
            playerId: string;
            remarks: string | null;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        startTime: string | null;
        endTime: string | null;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
    }>;
    listSchedule(): Promise<import("./training.service").TrainingScheduleSlot[]>;
    addScheduleSlot(dto: CreateTrainingScheduleSlotDto): Promise<import("./training.service").TrainingScheduleSlot>;
    updateScheduleSlot(id: string, dto: UpdateTrainingScheduleSlotDto): Promise<import("./training.service").TrainingScheduleSlot>;
    removeScheduleSlot(id: string): Promise<void>;
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
            academyId: string;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
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
            academyId: string;
            playerId: string;
            remarks: string | null;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        startTime: string | null;
        endTime: string | null;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
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
            status: import(".prisma/client").$Enums.TrainingSessionStatus;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            startTime: string | null;
            endTime: string | null;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            trainingPlanId: string | null;
            conductedByCoachId: string | null;
            date: Date;
        };
        recordedByUser: {
            id: string;
            firstName: string;
            lastName: string;
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
    }>;
    updateSession(id: string, dto: UpdateTrainingSessionDto, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
            academyId: string;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
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
            academyId: string;
            playerId: string;
            remarks: string | null;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        startTime: string | null;
        endTime: string | null;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
    }>;
    recordAttendance(id: string, dto: RecordAttendanceDto, user: RequestUser): Promise<{
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
            academyId: string;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
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
            academyId: string;
            playerId: string;
            remarks: string | null;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        startTime: string | null;
        endTime: string | null;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
            academyId: string;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
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
            academyId: string;
            playerId: string;
            remarks: string | null;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        startTime: string | null;
        endTime: string | null;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
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
        trainingGroup: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
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
            academyId: string;
            location: string | null;
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        conductedByCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            academyId: string;
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
            academyId: string;
            playerId: string;
            remarks: string | null;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            name: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        startTime: string | null;
        endTime: string | null;
        location: string | null;
        teamId: string;
        trainingGroupId: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
    }>;
    getActivityMarks(activityId: string, user: RequestUser): Promise<{
        activity: {
            trainingPlan: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                assessmentCriteria: string | null;
                academyId: string;
                location: string | null;
                teamId: string;
                trainingGroupId: string | null;
                coachId: string;
                title: string;
                objectives: string | null;
                scheduledDate: Date;
                scheduledStart: string | null;
                scheduledEnd: string | null;
                requiredEquipment: string | null;
                skillsFocus: string | null;
                approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
                version: number;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
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
            academyId: string;
            playerId: string;
            trainingActivityId: string;
            ratedByCoachId: string;
            rating: number;
            remarks: string | null;
        })[];
    }>;
    upsertActivityMarks(activityId: string, dto: UpsertActivityMarksDto, user: RequestUser): Promise<{
        activity: {
            trainingPlan: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                assessmentCriteria: string | null;
                academyId: string;
                location: string | null;
                teamId: string;
                trainingGroupId: string | null;
                coachId: string;
                title: string;
                objectives: string | null;
                scheduledDate: Date;
                scheduledStart: string | null;
                scheduledEnd: string | null;
                requiredEquipment: string | null;
                skillsFocus: string | null;
                approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
                version: number;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
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
            academyId: string;
            playerId: string;
            trainingActivityId: string;
            ratedByCoachId: string;
            rating: number;
            remarks: string | null;
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
            name: string;
            description: string | null;
            academyId: string;
            sortOrder: number;
            trainingPlanId: string;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
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
        academyId: string;
        playerId: string;
        trainingActivityId: string;
        ratedByCoachId: string;
        rating: number;
        remarks: string | null;
    })[]>;
    getTeamMarks(teamId: string, user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        player: {
            firstName: string;
            lastName: string;
        };
        playerId: string;
        trainingActivityId: string;
        rating: number;
    }[]>;
}
