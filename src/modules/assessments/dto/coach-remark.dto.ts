import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCoachRemarkDto {
  @ApiProperty()
  @IsString()
  remark!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  context?: string;
}
