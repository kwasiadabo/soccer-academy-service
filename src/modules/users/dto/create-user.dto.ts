import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ROLE_NAMES } from '../../rbac/permissions.constants';

// Every account created here must belong to a real, already-registered staff
// member (a Coach row — see schema.prisma's Tenancy note on Coach doubling as
// the generic staff-profile table) — never a free-standing identity. Parents
// get accounts through GrantGuardianPortalAccessDto instead, which is why
// PARENT/PLAYER aren't in this list.
const STAFF_GRANTABLE_ROLES = [
  ROLE_NAMES.ADMIN,
  ROLE_NAMES.RECEPTIONIST,
  ROLE_NAMES.HEAD_COACH,
  ROLE_NAMES.COACH,
] as const;

export class CreateUserDto {
  @ApiProperty({ description: 'The Coach (staff) record this account belongs to — must not already have one' })
  @IsString()
  coachId!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ type: [String], enum: STAFF_GRANTABLE_ROLES, description: 'Role names to assign' })
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(STAFF_GRANTABLE_ROLES, { each: true })
  roleNames!: string[];

  @ApiProperty({
    required: false,
    description: 'Force this user to change their password on first login. Defaults to true.',
  })
  @IsOptional()
  @IsBoolean()
  mustChangePassword?: boolean;
}
