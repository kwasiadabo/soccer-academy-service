import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class InitializePaymentDto {
  @ApiProperty({ description: 'Where Paystack should redirect back to after checkout' })
  @IsUrl({ require_tld: false })
  callbackUrl!: string;
}
