import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class ResetUserPasswordDto {
  @ApiProperty({
    required: false,
    description: 'Set this exact temporary password. If omitted, an emailed reset link is sent instead.',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
