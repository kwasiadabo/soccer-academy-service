import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { PlayerStatus } from '@prisma/client';

const SETTABLE_STATUSES = ['ACTIVE', 'SUSPENDED', 'WITHDRAWN'] as const;

export class UpdatePlayerStatusDto {
  @ApiProperty({ enum: SETTABLE_STATUSES })
  @IsIn(SETTABLE_STATUSES)
  status!: Extract<PlayerStatus, 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN'>;
}
