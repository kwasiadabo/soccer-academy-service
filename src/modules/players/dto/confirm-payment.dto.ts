import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

// Registration payments are collected in person at the front desk — limited to
// cash and mobile money (which can also be charged live via Paystack).
const REGISTRATION_PAYMENT_METHODS = [PaymentMethod.CASH, PaymentMethod.MOBILE_MONEY] as const;

export class ConfirmRegistrationPaymentDto {
  @ApiProperty({ enum: REGISTRATION_PAYMENT_METHODS })
  @IsIn(REGISTRATION_PAYMENT_METHODS)
  method!: PaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reference?: string;
}
