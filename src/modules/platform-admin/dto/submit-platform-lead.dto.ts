import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SubmitPlatformLeadDto {
  @ApiProperty({ description: 'The prospective academy\'s name' })
  @IsString()
  @MinLength(2)
  academyName!: string;

  @ApiProperty({ description: 'Where the academy trains — town/area or venue name' })
  @IsString()
  @MinLength(2)
  trainingLocation!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  contactName!: string;

  @ApiProperty()
  @IsEmail()
  contactEmail!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  contactPhone!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
