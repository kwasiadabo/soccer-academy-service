import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { MatchesService } from './matches.service';
import { CreateOpponentDto } from './dto/opponent.dto';
import { CreateMatchDto, UpdateMatchDto } from './dto/match.dto';
import { SetParticipationsDto } from './dto/match-participation.dto';
import { CreateMatchPlayerAssessmentDto } from './dto/match-player-assessment.dto';

@ApiTags('matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('opponents')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  listOpponents() {
    return this.matchesService.listOpponents();
  }

  @Post('opponents')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'OPPONENT_CREATE', entityType: 'Opponent' })
  createOpponent(@Body() dto: CreateOpponentDto) {
    return this.matchesService.createOpponent(dto);
  }

  @Get('matches')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  findAll(@CurrentUser() user: RequestUser) {
    return this.matchesService.findAll(user);
  }

  @Get('matches/:id')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.matchesService.findOne(id, user);
  }

  @Post('matches')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'MATCH_CREATE', entityType: 'Match' })
  create(@Body() dto: CreateMatchDto, @CurrentUser() user: RequestUser) {
    return this.matchesService.create(user, dto);
  }

  @Patch('matches/:id')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'MATCH_UPDATE', entityType: 'Match' })
  update(@Param('id') id: string, @Body() dto: UpdateMatchDto, @CurrentUser() user: RequestUser) {
    return this.matchesService.update(id, user, dto);
  }

  @Post('matches/:id/participations')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'MATCH_PARTICIPATIONS_SET', entityType: 'Match' })
  setParticipations(@Param('id') id: string, @Body() dto: SetParticipationsDto, @CurrentUser() user: RequestUser) {
    return this.matchesService.setParticipations(id, user, dto);
  }

  @Post('matches/:id/assessments')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'MATCH_PLAYER_ASSESSMENT_CREATE', entityType: 'Match' })
  addPlayerAssessment(
    @Param('id') id: string,
    @Body() dto: CreateMatchPlayerAssessmentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.matchesService.addPlayerAssessment(id, user, dto);
  }
}
