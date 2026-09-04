import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ProductCategory })
  @IsEnum(ProductCategory)
  category!: ProductCategory;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  basePrice!: number;
}
