import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEmail, IsIn } from 'class-validator';
import { ROLE_NAMES } from '../../rbac/permissions.constants';

const GRANTABLE_ROLES = [ROLE_NAMES.COACH, ROLE_NAMES.HEAD_COACH] as const;

export class GrantCoachPortalAccessDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: GRANTABLE_ROLES, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(GRANTABLE_ROLES, { each: true })
  roleNames!: string[];
}
