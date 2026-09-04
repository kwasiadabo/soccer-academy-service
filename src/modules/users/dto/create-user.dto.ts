import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ type: [String], description: 'Role names to assign' })
  @IsArray()
  @IsString({ each: true })
  roleNames!: string[];

  @ApiProperty({
    required: false,
    description: 'Force this user to change their password on first login. Defaults to true for Parent accounts.',
  })
  @IsOptional()
  @IsBoolean()
  mustChangePassword?: boolean;
}
