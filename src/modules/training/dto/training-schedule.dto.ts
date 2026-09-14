import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export class UpdateTrainingScheduleDto {
  @ApiProperty({ required: false, minimum: 0, maximum: 6, description: '0 = Sunday .. 6 = Saturday' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @ApiProperty({ required: false, example: '08:00' })
  @IsOptional()
  @IsString()
  @Matches(TIME_PATTERN, { message: 'startTime must be in HH:mm format' })
  startTime?: string;

  @ApiProperty({ required: false, example: '10:00' })
  @IsOptional()
  @IsString()
  @Matches(TIME_PATTERN, { message: 'endTime must be in HH:mm format' })
  endTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;
}
