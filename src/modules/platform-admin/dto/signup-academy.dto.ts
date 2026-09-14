import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

// Public self-serve signup — distinct from OnboardAcademyDto (platform-admin
// only): here the admin sets their own password immediately rather than
// receiving a one-time temporary one, since they're creating the account for
// themselves right now, not having it created for them by someone else.
export class SignupAcademyDto {
  @ApiProperty({ description: 'URL-safe subdomain, e.g. "riverside" for riverside.sams.app' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'slug must be lowercase letters, digits, and hyphens only' })
  slug!: string;

  @ApiProperty({ description: "The academy's display name" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ required: false, description: 'Shown on receipts, favicon, and the public page — defaults to name' })
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

  @ApiProperty()
  @IsString()
  @MinLength(8)
  adminPassword!: string;
}
