import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateTrainingActivityInputDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  skillsDeveloped?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class CreateTrainingPlanDto {
  @ApiProperty()
  @IsUUID()
  teamId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  trainingGroupId?: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  objectives?: string;

  @ApiProperty()
  @IsDateString()
  scheduledDate!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scheduledStart?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scheduledEnd?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  requiredEquipment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  skillsFocus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assessmentCriteria?: string;

  @ApiProperty({ required: false, type: [CreateTrainingActivityInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTrainingActivityInputDto)
  activities?: CreateTrainingActivityInputDto[];
}

export class UpdateTrainingPlanDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  objectives?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scheduledStart?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scheduledEnd?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  requiredEquipment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  skillsFocus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assessmentCriteria?: string;
}
