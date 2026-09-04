import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { DominantFoot, Gender, GuardianRelationship } from '@prisma/client';

export class CreateGuardianInputDto {
  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ enum: GuardianRelationship })
  @IsEnum(GuardianRelationship)
  relationship!: GuardianRelationship;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreatePlayerDto {
  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  residentialAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  medicalNotes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  previousExperience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredPosition?: string;

  @ApiProperty({ required: false, enum: DominantFoot })
  @IsOptional()
  @IsEnum(DominantFoot)
  dominantFoot?: DominantFoot;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  ageCategoryId?: string;

  @ApiProperty({ type: [CreateGuardianInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateGuardianInputDto)
  guardians!: CreateGuardianInputDto[];
}
