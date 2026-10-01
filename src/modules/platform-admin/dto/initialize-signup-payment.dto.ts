import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl, Matches, MinLength } from 'class-validator';

// Step one of the paid self-serve signup: charges the signup fee and, the
// instant payment is initialized, persists these details as a
// PendingAcademySignup — not as an Academy — so the academy can resume from
// its email link however long it takes to actually pay (see
// PlatformAdminService#initializeSignupPayment).
export class InitializeSignupPaymentDto {
  @ApiProperty({ description: "The academy's display name" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ description: 'URL-safe subdomain, e.g. "riverside" for riverside.sams.app' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'slug must be lowercase letters, digits, and hyphens only' })
  slug!: string;

  @ApiProperty()
  @IsString()
  adminFirstName!: string;

  @ApiProperty()
  @IsString()
  adminLastName!: string;

  @ApiProperty({ description: "The signing-up admin's email — used as the Paystack charge email" })
  @IsEmail()
  adminEmail!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  adminPassword!: string;

  @ApiProperty({ description: 'Where Paystack redirects back to after checkout' })
  @IsUrl({ require_tld: false })
  callbackUrl!: string;
}
