import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateAgeCategoryDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Unique short code, e.g. U12' })
  @IsString()
  code!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  minAge!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  maxAge!: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateAgeCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  minAge?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  maxAge?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
