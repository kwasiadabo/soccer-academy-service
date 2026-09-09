import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('opponents')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @ApiOperation({ summary: 'List opponent clubs.' })
  @ApiOkResponse({ description: 'Opponents returned.' })
  listOpponents() {
    return this.matchesService.listOpponents();
  }

  @Post('opponents')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'OPPONENT_CREATE', entityType: 'Opponent' })
  @ApiOperation({ summary: 'Create an opponent club.' })
  @ApiCreatedResponse({ description: 'Opponent created.' })
  createOpponent(@Body() dto: CreateOpponentDto) {
    return this.matchesService.createOpponent(dto);
  }

  @Get('matches')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @ApiOperation({ summary: 'List matches.' })
  @ApiOkResponse({ description: 'Matches returned.' })
  findAll(@CurrentUser() user: RequestUser) {
    return this.matchesService.findAll(user);
  }

  @Get('matches/:id')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @ApiOperation({ summary: 'Get a match by ID.' })
  @ApiOkResponse({ description: 'Match returned.' })
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.matchesService.findOne(id, user);
  }

  @Post('matches')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'MATCH_CREATE', entityType: 'Match' })
  @ApiOperation({ summary: 'Schedule a match.' })
  @ApiCreatedResponse({ description: 'Match created.' })
  create(@Body() dto: CreateMatchDto, @CurrentUser() user: RequestUser) {
    return this.matchesService.create(user, dto);
  }

  @Patch('matches/:id')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'MATCH_UPDATE', entityType: 'Match' })
  @ApiOperation({ summary: 'Update a match.' })
  @ApiOkResponse({ description: 'Match updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateMatchDto, @CurrentUser() user: RequestUser) {
    return this.matchesService.update(id, user, dto);
  }

  @Post('matches/:id/participations')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'MATCH_PARTICIPATIONS_SET', entityType: 'Match' })
  @ApiOperation({ summary: 'Set the squad/participations for a match.' })
  @ApiCreatedResponse({ description: 'Participations set.' })
  setParticipations(@Param('id') id: string, @Body() dto: SetParticipationsDto, @CurrentUser() user: RequestUser) {
    return this.matchesService.setParticipations(id, user, dto);
  }

  @Post('matches/:id/assessments')
  @RequirePermissions(PERMISSIONS.MATCHES_MANAGE)
  @AuditLog({ action: 'MATCH_PLAYER_ASSESSMENT_CREATE', entityType: 'Match' })
  @ApiOperation({ summary: 'Add a player assessment for a match.' })
  @ApiCreatedResponse({ description: 'Assessment created.' })
  addPlayerAssessment(
    @Param('id') id: string,
    @Body() dto: CreateMatchPlayerAssessmentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.matchesService.addPlayerAssessment(id, user, dto);
  }
}
