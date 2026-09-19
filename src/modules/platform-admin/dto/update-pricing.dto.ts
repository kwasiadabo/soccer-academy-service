import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdatePricingDto {
  @ApiProperty({ description: 'GHS amount charged per active player per month' })
  @IsNumber()
  @Min(0)
  pricePerPlayer!: number;

  @ApiProperty({ description: 'One-time GHS fee charged during self-serve signup, before payment' })
  @IsNumber()
  @Min(0)
  signupFee!: number;
}
