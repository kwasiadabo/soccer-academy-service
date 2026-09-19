import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUrl } from 'class-validator';

export class InitializeSignupPaymentDto {
  @ApiProperty({ description: "The signing-up admin's email — used as the Paystack charge email" })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Where Paystack redirects back to after checkout' })
  @IsUrl({ require_tld: false })
  callbackUrl!: string;
}
