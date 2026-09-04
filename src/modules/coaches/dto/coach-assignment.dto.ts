import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CoachAssignmentRole } from '@prisma/client';

export class CreateCoachAssignmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  trainingGroupId?: string;

  @ApiProperty({ enum: CoachAssignmentRole, default: CoachAssignmentRole.PRIMARY })
  @IsEnum(CoachAssignmentRole)
  role!: CoachAssignmentRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}

export class EndCoachAssignmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}
