import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class PaymentAllocationInputDto {
  @ApiProperty()
  @IsUUID()
  invoiceId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  amount!: number;
}

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  playerId!: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ type: [PaymentAllocationInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentAllocationInputDto)
  allocations!: PaymentAllocationInputDto[];
}
