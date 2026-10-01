import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

// Used from the link in the resume/reminder/deletion-warning emails — looks
// up the PendingAcademySignup by its stable resumeToken and issues a fresh
// Paystack transaction, since the original reference is single-use and may
// be long expired by the time this is clicked.
export class ResumeSignupPaymentDto {
  @ApiProperty()
  @IsString()
  resumeToken!: string;

  @ApiProperty({ description: 'Where Paystack redirects back to after checkout' })
  @IsUrl({ require_tld: false })
  callbackUrl!: string;
}
