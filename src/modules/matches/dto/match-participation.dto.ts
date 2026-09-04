import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export class ParticipationInputDto {
  @ApiProperty()
  @IsUUID()
  playerId!: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isStarting?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isSubstitute?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  positionPlayed?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  minutesPlayed?: number;
}

export class SetParticipationsDto {
  @ApiProperty({ type: [ParticipationInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ParticipationInputDto)
  records!: ParticipationInputDto[];
}
