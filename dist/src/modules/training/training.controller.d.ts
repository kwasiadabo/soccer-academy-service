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
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        coach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
        };
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        activities: {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            trainingPlanId: string;
            submittedByUserId: string;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        coachId: string;
        teamId: string;
        trainingGroupId: string | null;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        assessmentCriteria: string | null;
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
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        coach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
        };
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        activities: {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            trainingPlanId: string;
            submittedByUserId: string;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        coachId: string;
        teamId: string;
        trainingGroupId: string | null;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        assessmentCriteria: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    createPlan(dto: CreateTrainingPlanDto, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        coach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
        };
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        activities: {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            trainingPlanId: string;
            submittedByUserId: string;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        coachId: string;
        teamId: string;
        trainingGroupId: string | null;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        assessmentCriteria: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    updatePlan(id: string, dto: UpdateTrainingPlanDto, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        coach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
        };
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        activities: {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            trainingPlanId: string;
            submittedByUserId: string;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        coachId: string;
        teamId: string;
        trainingGroupId: string | null;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        assessmentCriteria: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    addActivity(id: string, dto: CreateTrainingActivityInputDto, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        coach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
        };
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        activities: {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            trainingPlanId: string;
            submittedByUserId: string;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        coachId: string;
        teamId: string;
        trainingGroupId: string | null;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        assessmentCriteria: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    updateActivity(id: string, activityId: string, dto: UpdateTrainingActivityDto, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        coach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
        };
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        activities: {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            trainingPlanId: string;
            submittedByUserId: string;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        coachId: string;
        teamId: string;
        trainingGroupId: string | null;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        assessmentCriteria: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    removeActivity(id: string, activityId: string, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        coach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
        };
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        activities: {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            trainingPlanId: string;
            submittedByUserId: string;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        coachId: string;
        teamId: string;
        trainingGroupId: string | null;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        assessmentCriteria: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    submit(id: string, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        coach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
        };
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        activities: {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            trainingPlanId: string;
            submittedByUserId: string;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        coachId: string;
        teamId: string;
        trainingGroupId: string | null;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        assessmentCriteria: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    decide(id: string, dto: TrainingPlanDecisionDto, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        coach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
        };
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        activities: {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
            durationMinutes: number | null;
            skillsDeveloped: string | null;
        }[];
        approvals: {
            id: string;
            academyId: string;
            submittedAt: Date;
            trainingPlanId: string;
            submittedByUserId: string;
            reviewedByUserId: string | null;
            reviewedAt: Date | null;
            decision: import(".prisma/client").$Enums.TrainingApprovalStatus;
            comments: string | null;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        coachId: string;
        teamId: string;
        trainingGroupId: string | null;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        assessmentCriteria: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    findAllSessions(user: RequestUser): Promise<({
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        trainingPlan: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            coachId: string;
            teamId: string;
            trainingGroupId: string | null;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            assessmentCriteria: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        conductedByCoach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
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
            academyId: string;
            remarks: string | null;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            academyId: string;
            name: string;
            createdAt: Date;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
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
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        trainingPlan: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            coachId: string;
            teamId: string;
            trainingGroupId: string | null;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            assessmentCriteria: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        conductedByCoach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
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
            academyId: string;
            remarks: string | null;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            academyId: string;
            name: string;
            createdAt: Date;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
    }>;
    createSession(dto: CreateTrainingSessionDto, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        trainingPlan: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            coachId: string;
            teamId: string;
            trainingGroupId: string | null;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            assessmentCriteria: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        conductedByCoach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
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
            academyId: string;
            remarks: string | null;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            academyId: string;
            name: string;
            createdAt: Date;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
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
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        trainingPlan: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            coachId: string;
            teamId: string;
            trainingGroupId: string | null;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            assessmentCriteria: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        conductedByCoach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
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
            academyId: string;
            remarks: string | null;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            academyId: string;
            name: string;
            createdAt: Date;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
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
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            trainingGroupId: string | null;
            location: string | null;
            trainingPlanId: string | null;
            status: import(".prisma/client").$Enums.TrainingSessionStatus;
            conductedByCoachId: string | null;
            date: Date;
            startTime: string | null;
            endTime: string | null;
        };
        recordedByUser: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        academyId: string;
        remarks: string | null;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        playerId: string;
        trainingSessionId: string;
        recordedByUserId: string;
        recordedAt: Date;
    }>;
    updateSession(id: string, dto: UpdateTrainingSessionDto, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        trainingPlan: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            coachId: string;
            teamId: string;
            trainingGroupId: string | null;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            assessmentCriteria: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        conductedByCoach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
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
            academyId: string;
            remarks: string | null;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            academyId: string;
            name: string;
            createdAt: Date;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
    }>;
    recordAttendance(id: string, dto: RecordAttendanceDto, user: RequestUser): Promise<{
        team: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        trainingPlan: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            coachId: string;
            teamId: string;
            trainingGroupId: string | null;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            assessmentCriteria: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        conductedByCoach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
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
            academyId: string;
            remarks: string | null;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            academyId: string;
            name: string;
            createdAt: Date;
            sortOrder: number;
            trainingSessionId: string;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
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
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        trainingPlan: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            coachId: string;
            teamId: string;
            trainingGroupId: string | null;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            assessmentCriteria: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        conductedByCoach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
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
            academyId: string;
            remarks: string | null;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            academyId: string;
            name: string;
            createdAt: Date;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
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
            academyId: string;
            branchId: string | null;
            name: string;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        trainingPlan: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            coachId: string;
            teamId: string;
            trainingGroupId: string | null;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
            requiredEquipment: string | null;
            skillsFocus: string | null;
            assessmentCriteria: string | null;
            approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
            version: number;
        } | null;
        trainingGroup: {
            id: string;
            academyId: string;
            branchId: string | null;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            teamId: string;
            primaryCoachId: string | null;
        } | null;
        conductedByCoach: {
            id: string;
            academyId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            firstName: string;
            middleName: string | null;
            lastName: string;
            phone: string | null;
            email: string | null;
            bio: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            deletedAt: Date | null;
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
            academyId: string;
            remarks: string | null;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            playerId: string;
            trainingSessionId: string;
            recordedByUserId: string;
            recordedAt: Date;
        })[];
        sessionActivities: {
            id: string;
            academyId: string;
            name: string;
            createdAt: Date;
            sortOrder: number;
            trainingSessionId: string;
        }[];
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        status: import(".prisma/client").$Enums.TrainingSessionStatus;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
    }>;
    getActivityMarks(activityId: string, user: RequestUser): Promise<{
        activity: {
            trainingPlan: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                coachId: string;
                teamId: string;
                trainingGroupId: string | null;
                title: string;
                objectives: string | null;
                scheduledDate: Date;
                scheduledStart: string | null;
                scheduledEnd: string | null;
                location: string | null;
                requiredEquipment: string | null;
                skillsFocus: string | null;
                assessmentCriteria: string | null;
                approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
                version: number;
            };
        } & {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
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
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            remarks: string | null;
            trainingActivityId: string;
            playerId: string;
            ratedByCoachId: string;
            rating: number;
        })[];
    }>;
    upsertActivityMarks(activityId: string, dto: UpsertActivityMarksDto, user: RequestUser): Promise<{
        activity: {
            trainingPlan: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                coachId: string;
                teamId: string;
                trainingGroupId: string | null;
                title: string;
                objectives: string | null;
                scheduledDate: Date;
                scheduledStart: string | null;
                scheduledEnd: string | null;
                location: string | null;
                requiredEquipment: string | null;
                skillsFocus: string | null;
                assessmentCriteria: string | null;
                approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
                version: number;
            };
        } & {
            id: string;
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
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
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            remarks: string | null;
            trainingActivityId: string;
            playerId: string;
            ratedByCoachId: string;
            rating: number;
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
            academyId: string;
            name: string;
            sortOrder: number;
            trainingPlanId: string;
            description: string | null;
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
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        trainingActivityId: string;
        playerId: string;
        ratedByCoachId: string;
        rating: number;
    })[]>;
    getTeamMarks(teamId: string, user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        player: {
            firstName: string;
            lastName: string;
        };
        trainingActivityId: string;
        playerId: string;
        rating: number;
    }[]>;
}
