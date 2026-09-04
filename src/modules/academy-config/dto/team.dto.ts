import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsUUID()
  ageCategoryId!: string;

  @ApiProperty()
  @IsUUID()
  seasonId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  headCoachId?: string;
}

export class UpdateTeamDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  headCoachId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
