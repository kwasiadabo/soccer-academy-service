import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class OnboardAcademyDto {
  @ApiProperty({ description: 'URL-safe subdomain, e.g. "riverside" for riverside.sams.app' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'slug must be lowercase letters, digits, and hyphens only' })
  slug!: string;

  @ApiProperty({ description: "The academy's display name" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ required: false, description: 'Defaults to name if omitted' })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiProperty()
  @IsEmail()
  adminEmail!: string;

  @ApiProperty()
  @IsString()
  adminFirstName!: string;

  @ApiProperty()
  @IsString()
  adminLastName!: string;
}
