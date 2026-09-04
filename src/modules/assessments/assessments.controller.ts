import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get('templates')
  @RequireAnyPermission(...ANY_ASSESSMENT_ACCESS)
  findAllTemplates() {
    return this.assessmentsService.findAllTemplates();
  }

  @Get('oversight')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_VIEW)
  findAllOversight(@Query('teamId') teamId?: string, @Query('trainingSessionId') trainingSessionId?: string) {
    return this.assessmentsService.findAllOversight(teamId, trainingSessionId);
  }

  @Post('templates')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES)
  @AuditLog({ action: 'ASSESSMENT_TEMPLATE_CREATE', entityType: 'AssessmentTemplate' })
  createTemplate(@Body() dto: CreateAssessmentTemplateDto) {
    return this.assessmentsService.createTemplate(dto);
  }

  @Patch('templates/:id')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES)
  @AuditLog({ action: 'ASSESSMENT_TEMPLATE_UPDATE', entityType: 'AssessmentTemplate' })
  updateTemplate(@Param('id') id: string, @Body() dto: UpdateAssessmentTemplateDto) {
    return this.assessmentsService.updateTemplate(id, dto);
  }

  @Post('templates/:id/criteria')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES)
  @AuditLog({ action: 'ASSESSMENT_CRITERIA_CREATE', entityType: 'AssessmentTemplate' })
  addCriteria(@Param('id') id: string, @Body() dto: CreateAssessmentCriteriaInputDto) {
    return this.assessmentsService.addCriteria(id, dto);
  }

  @Get('players/:playerId')
  @RequireAnyPermission(PERMISSIONS.ASSESSMENTS_VIEW, PERMISSIONS.ASSESSMENTS_MANAGE_OWN)
  findForPlayer(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.assessmentsService.findForPlayer(playerId, user);
  }

  @Post('players/:playerId')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_OWN)
  @AuditLog({ action: 'PLAYER_ASSESSMENT_CREATE', entityType: 'PlayerAssessment' })
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
  findRemarks(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.assessmentsService.findRemarksForPlayer(playerId, user);
  }

  @Post('players/:playerId/remarks')
  @RequirePermissions(PERMISSIONS.ASSESSMENTS_MANAGE_OWN)
  @AuditLog({ action: 'COACH_REMARK_CREATE', entityType: 'CoachRemark' })
  createRemark(
    @Param('playerId') playerId: string,
    @Body() dto: CreateCoachRemarkDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assessmentsService.createRemark(playerId, user.userId, dto);
  }
}
