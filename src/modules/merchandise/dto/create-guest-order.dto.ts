import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEmail, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { OrderItemInputDto } from './create-order.dto';

export class CreateGuestOrderDto {
  @ApiProperty({ description: "The player's unique registration code" })
  @IsString()
  @MinLength(1)
  playerCode!: string;

  @ApiProperty({ description: 'Name of the person placing the order' })
  @IsString()
  @MinLength(1)
  guestName!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  guestPhone!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];
}
