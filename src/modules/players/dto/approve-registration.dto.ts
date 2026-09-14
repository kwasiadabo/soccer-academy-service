import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class ApproveRegistrationDto {
  // Which of the Registration fee's items actually apply to this player (e.g.
  // a returning player might skip the jersey) — omitted or empty charges
  // nothing extra beyond whichever items are selected; leave unset entirely
  // to fall back to the full registration fee, unchanged from before this
  // selection existed.
  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  feeItemIds?: string[];
}
