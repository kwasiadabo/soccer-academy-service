import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSessionActivityDto {
  @ApiProperty()
  @IsString()
  name!: string;
}
