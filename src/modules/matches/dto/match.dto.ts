import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { MatchStatus } from '@prisma/client';

export class CreateMatchDto {
  @ApiProperty()
  @IsUUID()
  teamId!: string;

  @ApiProperty()
  @IsUUID()
  opponentId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  competitionName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiProperty()
  @IsDateString()
  matchDate!: string;
}

export class UpdateMatchDto {
  @ApiProperty({ required: false, enum: MatchStatus })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  homeScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  awayScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  matchDate?: string;
}
