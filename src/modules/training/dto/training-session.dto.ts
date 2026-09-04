import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsIn, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus, TrainingSessionStatus } from '@prisma/client';

export class CreateTrainingSessionDto {
  @ApiProperty()
  @IsUUID()
  teamId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  trainingGroupId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  trainingPlanId?: string;

  @ApiProperty()
  @IsDateString()
  date!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateTrainingSessionDto {
  @ApiProperty({ required: false, enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  @IsIn(['SCHEDULED', 'COMPLETED', 'CANCELLED'])
  status?: TrainingSessionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;
}

export class GetOrCreateSaturdaySessionDto {
  @ApiProperty()
  @IsUUID()
  teamId!: string;

  @ApiProperty({ required: false, description: 'Defaults to today; rolled back to the Saturday of its week' })
  @IsOptional()
  @IsDateString()
  date?: string;
}

export class QuickMarkAttendanceDto {
  @ApiProperty()
  @IsUUID()
  playerId!: string;

  @ApiProperty({ required: false, enum: AttendanceStatus, default: 'PRESENT' })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;
}

export class AttendanceRecordInputDto {
  @ApiProperty()
  @IsUUID()
  playerId!: string;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class RecordAttendanceDto {
  @ApiProperty({ type: [AttendanceRecordInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordInputDto)
  records!: AttendanceRecordInputDto[];
}
