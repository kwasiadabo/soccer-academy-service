import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { TrainingApprovalStatus } from '@prisma/client';

const DECISION_VALUES = [
  TrainingApprovalStatus.APPROVED,
  TrainingApprovalStatus.REJECTED,
  TrainingApprovalStatus.CHANGES_REQUESTED,
] as const;

export class TrainingPlanDecisionDto {
  @ApiProperty({ enum: DECISION_VALUES })
  @IsIn(DECISION_VALUES, { message: 'decision must be one of APPROVED, REJECTED, CHANGES_REQUESTED' })
  decision!: (typeof DECISION_VALUES)[number];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string;
}
