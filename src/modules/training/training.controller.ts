import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TrainingApprovalStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequireAnyPermission, RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { TrainingService } from './training.service';
import { CreateTrainingActivityInputDto, CreateTrainingPlanDto, UpdateTrainingPlanDto } from './dto/training-plan.dto';
import { UpdateTrainingActivityDto } from './dto/training-activity.dto';
import { TrainingPlanDecisionDto } from './dto/training-decision.dto';
import {
  CreateTrainingSessionDto,
  GetOrCreateSaturdaySessionDto,
  QuickMarkAttendanceDto,
  RecordAttendanceDto,
  UpdateTrainingSessionDto,
} from './dto/training-session.dto';
import { UpsertActivityMarksDto } from './dto/training-activity-mark.dto';
import { CreateSessionActivityDto } from './dto/training-session-activity.dto';

const OWN_OR_APPROVE = [PERMISSIONS.TRAINING_MANAGE_OWN, PERMISSIONS.TRAINING_APPROVE] as const;
// Reception marks attendance for sessions coaches have already scheduled — they need to
// see every session and record attendance, but not create/edit sessions or plans.
const VIEW_SESSIONS = [
  PERMISSIONS.TRAINING_MANAGE_OWN,
  PERMISSIONS.TRAINING_APPROVE,
  PERMISSIONS.TRAINING_ATTENDANCE_RECORD,
] as const;
const RECORD_ATTENDANCE = [PERMISSIONS.TRAINING_MANAGE_OWN, PERMISSIONS.TRAINING_ATTENDANCE_RECORD] as const;

@ApiTags('training')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  // --- Plans ---
  @Get('plans')
  @RequireAnyPermission(...OWN_OR_APPROVE)
  findAllPlans(@CurrentUser() user: RequestUser, @Query('status') status?: TrainingApprovalStatus) {
    return this.trainingService.findAllPlans(user, status);
  }

  @Get('plans/teams')
  @RequireAnyPermission(...VIEW_SESSIONS)
  listTeams(@CurrentUser() user: RequestUser) {
    return this.trainingService.listTeamsForPicker(user);
  }

  @Get('plans/:id')
  @RequireAnyPermission(...OWN_OR_APPROVE)
  findOnePlan(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.findOnePlan(id, user);
  }

  @Post('plans')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_PLAN_CREATE', entityType: 'TrainingPlan' })
  createPlan(@Body() dto: CreateTrainingPlanDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.createPlan(user.userId, dto);
  }

  @Patch('plans/:id')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_PLAN_UPDATE', entityType: 'TrainingPlan' })
  updatePlan(@Param('id') id: string, @Body() dto: UpdateTrainingPlanDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.updatePlan(id, user.userId, dto);
  }

  @Post('plans/:id/activities')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_ACTIVITY_CREATE', entityType: 'TrainingPlan' })
  addActivity(
    @Param('id') id: string,
    @Body() dto: CreateTrainingActivityInputDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.trainingService.addActivity(id, user.userId, dto);
  }

  @Patch('plans/:id/activities/:activityId')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_ACTIVITY_UPDATE', entityType: 'TrainingPlan' })
  updateActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
    @Body() dto: UpdateTrainingActivityDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.trainingService.updateActivity(id, activityId, user.userId, dto);
  }

  @Delete('plans/:id/activities/:activityId')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_ACTIVITY_DELETE', entityType: 'TrainingPlan' })
  removeActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.trainingService.removeActivity(id, activityId, user.userId);
  }

  @Post('plans/:id/submit')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_PLAN_SUBMIT', entityType: 'TrainingPlan' })
  submit(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.submit(id, user.userId);
  }

  @Post('plans/:id/decision')
  @RequirePermissions(PERMISSIONS.TRAINING_APPROVE)
  @AuditLog({ action: 'TRAINING_PLAN_DECISION', entityType: 'TrainingPlan' })
  decide(@Param('id') id: string, @Body() dto: TrainingPlanDecisionDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.decide(id, user.userId, dto);
  }

  // --- Sessions ---
  @Get('sessions')
  @RequireAnyPermission(...VIEW_SESSIONS)
  findAllSessions(@CurrentUser() user: RequestUser) {
    return this.trainingService.findAllSessions(user);
  }

  @Get('sessions/:id')
  @RequireAnyPermission(...VIEW_SESSIONS)
  findOneSession(@Param('id') id: string) {
    return this.trainingService.findOneSession(id);
  }

  @Post('sessions')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_SESSION_CREATE', entityType: 'TrainingSession' })
  createSession(@Body() dto: CreateTrainingSessionDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.createSession(user.userId, dto);
  }

  @Post('sessions/saturday')
  @RequireAnyPermission(...RECORD_ATTENDANCE)
  @AuditLog({ action: 'TRAINING_SESSION_SATURDAY_RESOLVE', entityType: 'TrainingSession' })
  getOrCreateSaturdaySession(@Body() dto: GetOrCreateSaturdaySessionDto) {
    return this.trainingService.getOrCreateSaturdaySession(dto.teamId, dto.date);
  }

  // Search-and-mark: no team selection needed — the player's own team resolves their
  // Saturday session behind the scenes.
  @Post('attendance/mark')
  @RequireAnyPermission(...RECORD_ATTENDANCE)
  @AuditLog({ action: 'TRAINING_ATTENDANCE_RECORD', entityType: 'TrainingSession' })
  quickMarkAttendance(@Body() dto: QuickMarkAttendanceDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.quickMarkAttendance(dto.playerId, user, dto.status);
  }

  @Patch('sessions/:id')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_SESSION_UPDATE', entityType: 'TrainingSession' })
  updateSession(@Param('id') id: string, @Body() dto: UpdateTrainingSessionDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.updateSession(id, user.userId, dto);
  }

  @Post('sessions/:id/attendance')
  @RequireAnyPermission(...RECORD_ATTENDANCE)
  @AuditLog({ action: 'TRAINING_ATTENDANCE_RECORD', entityType: 'TrainingSession' })
  recordAttendance(@Param('id') id: string, @Body() dto: RecordAttendanceDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.recordAttendance(id, user, dto);
  }

  @Post('sessions/:id/activities')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_SESSION_ACTIVITY_CREATE', entityType: 'TrainingSession' })
  addSessionActivity(@Param('id') id: string, @Body() dto: CreateSessionActivityDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.addSessionActivity(id, user, dto);
  }

  @Delete('sessions/:id/activities/:activityId')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_SESSION_ACTIVITY_DELETE', entityType: 'TrainingSession' })
  removeSessionActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.trainingService.removeSessionActivity(id, activityId, user);
  }

  // --- Activity Marks ---
  @Get('activities/:activityId/marks')
  @RequireAnyPermission(...OWN_OR_APPROVE)
  getActivityMarks(@Param('activityId') activityId: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.getActivityMarks(activityId, user);
  }

  @Post('activities/:activityId/marks')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_ACTIVITY_MARKS_RECORD', entityType: 'TrainingActivityMark' })
  upsertActivityMarks(
    @Param('activityId') activityId: string,
    @Body() dto: UpsertActivityMarksDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.trainingService.upsertActivityMarks(activityId, user, dto);
  }

  @Get('players/:playerId/marks')
  @RequireAnyPermission(...OWN_OR_APPROVE)
  getPlayerMarks(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.getPlayerMarks(playerId, user);
  }

  @Get('teams/:teamId/marks')
  @RequireAnyPermission(...OWN_OR_APPROVE)
  getTeamMarks(@Param('teamId') teamId: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.getTeamMarks(teamId, user);
  }
}
