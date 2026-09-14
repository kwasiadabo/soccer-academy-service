import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFeeTypeDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  // Can't be changed after creation (see UpdateFeeTypeDto) — create a new
  // fee instead, same as the old category could never be edited either.
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isRegistrationFee?: boolean;
}

export class UpdateFeeTypeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AddFeeTypeItemDto {
  @ApiProperty()
  @IsString()
  feeItemId!: string;

  // Set here, not on the fee item itself — the same item can be worth a
  // different amount on a different Fee.
  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount!: number;
}
