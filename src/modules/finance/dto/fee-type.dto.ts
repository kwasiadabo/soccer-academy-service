import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { FeeCategory } from '@prisma/client';

export class CreateFeeTypeDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: FeeCategory })
  @IsEnum(FeeCategory)
  category!: FeeCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
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
}
