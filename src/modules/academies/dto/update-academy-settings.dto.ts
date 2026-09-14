import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAcademySettingsDto {
  @ApiProperty({ required: false, description: "The academy's own record name (not its subdomain, which is fixed)" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ required: false, description: 'Shown on receipts, favicon, and the public page' })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiProperty({ required: false, description: 'Public contact email shown on the academy\'s own page' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ required: false, description: 'Where the academy trains — town/area or venue name' })
  @IsOptional()
  @IsString()
  trainingLocation?: string;
}
