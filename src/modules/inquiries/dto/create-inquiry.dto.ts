import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  childFirstName!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  childLastName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  childDateOfBirth?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(150)
  guardianName!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  guardianPhone!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  guardianEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredProgram?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
