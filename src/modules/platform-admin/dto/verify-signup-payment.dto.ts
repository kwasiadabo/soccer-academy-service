import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SignupAcademyDto } from './signup-academy.dto';

// The academy/admin details collected in step one of the signup flow, carried
// through the Paystack redirect (the browser navigates away entirely, so the
// frontend re-submits them here rather than relying on any server-side
// session) plus the payment reference to verify before creating anything.
export class VerifySignupPaymentDto extends SignupAcademyDto {
  @ApiProperty({ description: 'The Paystack transaction reference to verify' })
  @IsString()
  reference!: string;
}
