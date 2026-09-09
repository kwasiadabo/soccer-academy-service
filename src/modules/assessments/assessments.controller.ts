import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
import { RequireAnyPermission, RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { AssessmentsService } from './assessments.service';
import {
  CreateAssessmentCriteriaInputDto,
  CreateAssessmentTemplateDto,
  UpdateAssessmentTemplateDto,
} from './dto/assessment-template.dto';
import { CreatePlayerAssessmentDto, UpdatePlayerAssessmentDto } from './dto/player-assessment.dto';
import { CreateCoachRemarkDto } from './dto/coach-remark.dto';

const ANY_ASSESSMENT_ACCESS = [
  PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES,
  PERMISSIONS.ASSESSMENTS_MANAGE_OWN,
  PERMISSIONS.ASSESSMENTS_VIEW,
] as const;

@ApiTags('assessments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get('templates')
  @RequireAnyPermission(...ANY_ASSESSMENT_ACCESS)
  @ApiOperation({ summary: 'List all assessment templates.' })
  @ApiOkResponse({ description: 'Assessment templates returned.' })
  findAllTemplates() {
    return this.assessmentsService.findAllTemplates();
  }

  @Get('oversight')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_VIEW)
  @ApiOperation({ summary: 'List player assessments across the academy, optionally filtered by team or session.' })
  @ApiOkResponse({ description: 'Assessments returned.' })
  findAllOversight(@Query('teamId') teamId?: string, @Query('trainingSessionId') trainingSessionId?: string) {
    return this.assessmentsService.findAllOversight(teamId, trainingSessionId);
  }

  @Post('templates')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES)
  @AuditLog({ action: 'ASSESSMENT_TEMPLATE_CREATE', entityType: 'AssessmentTemplate' })
  @ApiOperation({ summary: 'Create an assessment template.' })
  @ApiCreatedResponse({ description: 'Assessment template created.' })
  createTemplate(@Body() dto: CreateAssessmentTemplateDto) {
    return this.assessmentsService.createTemplate(dto);
  }

  @Patch('templates/:id')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES)
  @AuditLog({ action: 'ASSESSMENT_TEMPLATE_UPDATE', entityType: 'AssessmentTemplate' })
  @ApiOperation({ summary: 'Update an assessment template.' })
  @ApiOkResponse({ description: 'Assessment template updated.' })
  updateTemplate(@Param('id') id: string, @Body() dto: UpdateAssessmentTemplateDto) {
    return this.assessmentsService.updateTemplate(id, dto);
  }

  @Post('templates/:id/criteria')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES)
  @AuditLog({ action: 'ASSESSMENT_CRITERIA_CREATE', entityType: 'AssessmentTemplate' })
  @ApiOperation({ summary: 'Add a criterion to an assessment template.' })
  @ApiCreatedResponse({ description: 'Criterion added.' })
  addCriteria(@Param('id') id: string, @Body() dto: CreateAssessmentCriteriaInputDto) {
    return this.assessmentsService.addCriteria(id, dto);
  }

  @Get('players/:playerId')
  @RequireAnyPermission(PERMISSIONS.ASSESSMENTS_VIEW, PERMISSIONS.ASSESSMENTS_MANAGE_OWN)
  @ApiOperation({ summary: "List a player's assessments." })
  @ApiOkResponse({ description: 'Assessments returned.' })
  findForPlayer(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.assessmentsService.findForPlayer(playerId, user);
  }

  @Post('players/:playerId')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_OWN)
  @AuditLog({ action: 'PLAYER_ASSESSMENT_CREATE', entityType: 'PlayerAssessment' })
  @ApiOperation({ summary: 'Create an assessment for a player.' })
  @ApiCreatedResponse({ description: 'Assessment created.' })
  createAssessment(
    @Param('playerId') playerId: string,
    @Body() dto: CreatePlayerAssessmentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assessmentsService.createAssessment(playerId, user.userId, dto);
  }

  @Patch('players/:playerId/:assessmentId')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_OWN)
  @AuditLog({ action: 'PLAYER_ASSESSMENT_UPDATE', entityType: 'PlayerAssessment' })
  @ApiOperation({ summary: "Update a player's assessment." })
  @ApiOkResponse({ description: 'Assessment updated.' })
  updateAssessment(
    @Param('playerId') playerId: string,
    @Param('assessmentId') assessmentId: string,
    @Body() dto: UpdatePlayerAssessmentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assessmentsService.updateAssessment(playerId, assessmentId, user.userId, dto);
  }

  @Get('players/:playerId/remarks')
  @RequireAnyPermission(PERMISSIONS.ASSESSMENTS_VIEW, PERMISSIONS.ASSESSMENTS_MANAGE_OWN)
  @ApiOperation({ summary: "List a player's coach remarks." })
  @ApiOkResponse({ description: 'Remarks returned.' })
  findRemarks(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.assessmentsService.findRemarksForPlayer(playerId, user);
  }

  @Post('players/:playerId/remarks')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_OWN)
  @AuditLog({ action: 'COACH_REMARK_CREATE', entityType: 'CoachRemark' })
  @ApiOperation({ summary: 'Add a coach remark for a player.' })
  @ApiCreatedResponse({ description: 'Remark created.' })
  createRemark(
    @Param('playerId') playerId: string,
    @Body() dto: CreateCoachRemarkDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assessmentsService.createRemark(playerId, user.userId, dto);
  }
}
