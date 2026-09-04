import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

const MOMO_PROVIDERS = ['mtn', 'vod', 'tgo'] as const;
export type MomoProviderCode = (typeof MOMO_PROVIDERS)[number];

export class InitiatePaystackChargeDto {
  @ApiProperty({ description: 'Mobile money number to charge, e.g. 0244123456' })
  @IsString()
  phone!: string;

  @ApiProperty({ enum: MOMO_PROVIDERS, description: 'mtn = MTN, vod = Vodafone/Telecel, tgo = AirtelTigo' })
  @IsIn(MOMO_PROVIDERS)
  provider!: MomoProviderCode;
}

export class VerifyPaystackChargeDto {
  @ApiProperty()
  @IsString()
  reference!: string;
}
