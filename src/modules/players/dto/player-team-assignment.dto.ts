import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdatePlayerTeamAssignmentDto {
  @ApiProperty({ required: false, nullable: true, description: 'Set to null to remove the player from their team' })
  @IsOptional()
  @IsUUID()
  teamId?: string | null;

  @ApiProperty({ required: false, nullable: true, description: 'Set to null to remove the player from their training group' })
  @IsOptional()
  @IsUUID()
  trainingGroupId?: string | null;
}
