import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { AssessmentCategory, RatingScaleType } from '@prisma/client';

export class CreateAssessmentCriteriaInputDto {
  @ApiProperty({ enum: AssessmentCategory })
  @IsEnum(AssessmentCategory)
  category!: AssessmentCategory;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class CreateAssessmentTemplateDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  ageCategoryId?: string;

  @ApiProperty({ required: false, enum: RatingScaleType, default: RatingScaleType.SCALE_1_5 })
  @IsOptional()
  @IsEnum(RatingScaleType)
  ratingScale?: RatingScaleType;

  @ApiProperty({ required: false, type: [CreateAssessmentCriteriaInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAssessmentCriteriaInputDto)
  criteria?: CreateAssessmentCriteriaInputDto[];
}

export class UpdateAssessmentTemplateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  ageCategoryId?: string;

  @ApiProperty({ required: false, enum: RatingScaleType })
  @IsOptional()
  @IsEnum(RatingScaleType)
  ratingScale?: RatingScaleType;
}
