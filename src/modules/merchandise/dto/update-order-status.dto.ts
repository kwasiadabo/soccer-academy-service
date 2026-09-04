import { ApiProperty } from '@nestjs/swagger';
import { MerchandiseOrderStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: MerchandiseOrderStatus })
  @IsEnum(MerchandiseOrderStatus)
  status!: MerchandiseOrderStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  staffNotes?: string;
}
