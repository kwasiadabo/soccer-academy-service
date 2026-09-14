import { AttendanceStatus, TrainingApprovalStatus } from '@prisma/client';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
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
import { UpdateTrainingScheduleDto } from './dto/training-schedule.dto';
export interface TrainingSchedule {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    location: string | null;
}
export declare class TrainingService {
    private readonly prisma;
    private readonly coachContext;
    private readonly email;
    private readonly sms;
    private readonly tenantContext;
    private readonly logger;
    constructor(prisma: PrismaService, coachContext: CoachContextService, email: EmailService, sms: SmsService, tenantContext: TenantContextService);
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
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    })[]>;
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
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    createPlan(userId: string, dto: CreateTrainingPlanDto): Promise<{
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
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    private assertOwnPlan;
    updatePlan(id: string, userId: string, dto: UpdateTrainingPlanDto): Promise<{
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
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    addActivity(planId: string, userId: string, dto: CreateTrainingActivityInputDto): Promise<{
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
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    updateActivity(planId: string, activityId: string, userId: string, dto: UpdateTrainingActivityDto): Promise<{
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
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    removeActivity(planId: string, activityId: string, userId: string): Promise<{
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
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
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
                academyId: string;
                teamId: string;
                trainingGroupId: string | null;
                coachId: string;
                title: string;
                objectives: string | null;
                scheduledDate: Date;
                scheduledStart: string | null;
                scheduledEnd: string | null;
                location: string | null;
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
    upsertActivityMarks(activityId: string, user: RequestUser, dto: UpsertActivityMarksDto): Promise<{
        activity: {
            trainingPlan: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                assessmentCriteria: string | null;
                academyId: string;
                teamId: string;
                trainingGroupId: string | null;
                coachId: string;
                title: string;
                objectives: string | null;
                scheduledDate: Date;
                scheduledStart: string | null;
                scheduledEnd: string | null;
                location: string | null;
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
    submit(id: string, userId: string): Promise<{
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
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    decide(id: string, reviewerUserId: string, dto: TrainingPlanDecisionDto): Promise<{
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
        teamId: string;
        trainingGroupId: string | null;
        coachId: string;
        title: string;
        objectives: string | null;
        scheduledDate: Date;
        scheduledStart: string | null;
        scheduledEnd: string | null;
        location: string | null;
        requiredEquipment: string | null;
        skillsFocus: string | null;
        approvalStatus: import(".prisma/client").$Enums.TrainingApprovalStatus;
        version: number;
    }>;
    private getSessionOrThrow;
    private assertOwnSession;
    private rosterFor;
    getSchedule(): Promise<TrainingSchedule>;
    updateSchedule(dto: UpdateTrainingScheduleDto): Promise<TrainingSchedule>;
    private ensureThisWeeksWeeklySessions;
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
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
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
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
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
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
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
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
    }>;
    createSession(user: RequestUser, dto: CreateTrainingSessionDto): Promise<{
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
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
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
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
    }>;
    updateSession(id: string, user: RequestUser, dto: UpdateTrainingSessionDto): Promise<{
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
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
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
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
    }>;
    private resolveFixtureDate;
    private getOrCreateWeeklySessionRecord;
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
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
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
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
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
    recordAttendance(id: string, user: RequestUser, dto: RecordAttendanceDto): Promise<{
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
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
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
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
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
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
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
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
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
            teamId: string;
            trainingGroupId: string | null;
            coachId: string;
            title: string;
            objectives: string | null;
            scheduledDate: Date;
            scheduledStart: string | null;
            scheduledEnd: string | null;
            location: string | null;
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
        teamId: string;
        trainingGroupId: string | null;
        location: string | null;
        trainingPlanId: string | null;
        conductedByCoachId: string | null;
        date: Date;
        startTime: string | null;
        endTime: string | null;
    }>;
}
