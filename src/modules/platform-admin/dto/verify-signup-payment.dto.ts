import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// Step two: the academy/admin details no longer travel through the frontend
// across the Paystack redirect — they were already persisted as a
// PendingAcademySignup when payment was initialized (see
// InitializeSignupPaymentDto) — so this only needs the reference to verify
// and look that row up.
export class VerifySignupPaymentDto {
  @ApiProperty({ description: 'The Paystack transaction reference to verify' })
  @IsString()
  reference!: string;
}
