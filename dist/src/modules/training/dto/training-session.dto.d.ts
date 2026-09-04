import { AttendanceStatus, TrainingSessionStatus } from '@prisma/client';
export declare class CreateTrainingSessionDto {
    teamId: string;
    trainingGroupId?: string;
    trainingPlanId?: string;
    date: string;
    startTime?: string;
    endTime?: string;
    location?: string;
}
export declare class UpdateTrainingSessionDto {
    status?: TrainingSessionStatus;
    date?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
}
export declare class GetOrCreateSaturdaySessionDto {
    teamId: string;
    date?: string;
}
export declare class QuickMarkAttendanceDto {
    playerId: string;
    status?: AttendanceStatus;
}
export declare class AttendanceRecordInputDto {
    playerId: string;
    status: AttendanceStatus;
    remarks?: string;
}
export declare class RecordAttendanceDto {
    records: AttendanceRecordInputDto[];
}
