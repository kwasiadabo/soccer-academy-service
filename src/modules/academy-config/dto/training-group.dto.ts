import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTrainingGroupDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsUUID()
  teamId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  primaryCoachId?: string;
}

export class UpdateTrainingGroupDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  primaryCoachId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
