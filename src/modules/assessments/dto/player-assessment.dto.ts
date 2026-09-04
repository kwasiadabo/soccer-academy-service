import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateAssessmentRatingInputDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  criteriaId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  sessionActivityId?: string;

  @ApiProperty()
  @IsNumber()
  ratingValue!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ratingLabel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreatePlayerAssessmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  trainingSessionId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  matchId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  strengths?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  areasForImprovement?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  developmentGoals?: string;

  @ApiProperty({ type: [CreateAssessmentRatingInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAssessmentRatingInputDto)
  ratings!: CreateAssessmentRatingInputDto[];
}

export class UpdatePlayerAssessmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  strengths?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  areasForImprovement?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  developmentGoals?: string;

  @ApiProperty({ type: [CreateAssessmentRatingInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAssessmentRatingInputDto)
  ratings!: CreateAssessmentRatingInputDto[];
}
