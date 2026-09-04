import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CoachFeedbackCriterionInputDto {
  @ApiProperty()
  @IsString()
  criterionName!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating!: number;
}

export class CreateCoachFeedbackDto {
  @ApiProperty()
  @IsUUID()
  coachId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(5)
  overallRating!: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({ required: false, type: [CoachFeedbackCriterionInputDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CoachFeedbackCriterionInputDto)
  criteria?: CoachFeedbackCriterionInputDto[];
}
