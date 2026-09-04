import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString, MinLength } from 'class-validator';

export class ReplaceGalleryPhotosDto {
  @ApiProperty({ description: 'Date of the Saturday session or match these photos are from' })
  @IsISO8601()
  sessionDate!: string;

  @ApiProperty({ description: 'Short description of the session, e.g. "vs Rangers FC — Home win 3-1"' })
  @IsString()
  @MinLength(1)
  details!: string;
}
