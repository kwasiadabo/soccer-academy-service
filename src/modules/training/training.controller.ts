import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  // --- Plans ---
  @Get('plans')
  @RequireAnyPermission(...OWN_OR_APPROVE)
  @ApiOperation({ summary: 'List training plans, optionally filtered by approval status.' })
  @ApiOkResponse({ description: 'Plans returned.' })
  findAllPlans(@CurrentUser() user: RequestUser, @Query('status') status?: TrainingApprovalStatus) {
    return this.trainingService.findAllPlans(user, status);
  }

  @Get('plans/teams')
  @RequireAnyPermission(...VIEW_SESSIONS)
  @ApiOperation({ summary: 'List teams the current user can pick a training plan for.' })
  @ApiOkResponse({ description: 'Teams returned.' })
  listTeams(@CurrentUser() user: RequestUser) {
    return this.trainingService.listTeamsForPicker(user);
  }

  @Get('plans/:id')
  @RequireAnyPermission(...OWN_OR_APPROVE)
  @ApiOperation({ summary: 'Get a training plan by ID.' })
  @ApiOkResponse({ description: 'Plan returned.' })
  findOnePlan(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.findOnePlan(id, user);
  }

  @Post('plans')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_PLAN_CREATE', entityType: 'TrainingPlan' })
  @ApiOperation({ summary: 'Create a training plan.' })
  @ApiCreatedResponse({ description: 'Plan created.' })
  createPlan(@Body() dto: CreateTrainingPlanDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.createPlan(user.userId, dto);
  }

  @Patch('plans/:id')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_PLAN_UPDATE', entityType: 'TrainingPlan' })
  @ApiOperation({ summary: 'Update a training plan.' })
  @ApiOkResponse({ description: 'Plan updated.' })
  updatePlan(@Param('id') id: string, @Body() dto: UpdateTrainingPlanDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.updatePlan(id, user.userId, dto);
  }

  @Post('plans/:id/activities')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_ACTIVITY_CREATE', entityType: 'TrainingPlan' })
  @ApiOperation({ summary: 'Add an activity to a training plan.' })
  @ApiCreatedResponse({ description: 'Activity added.' })
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
  @ApiOperation({ summary: 'Update a training plan activity.' })
  @ApiOkResponse({ description: 'Activity updated.' })
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
  @ApiOperation({ summary: 'Remove an activity from a training plan.' })
  @ApiOkResponse({ description: 'Activity removed.' })
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
  @ApiOperation({ summary: 'Submit a training plan for approval.' })
  @ApiCreatedResponse({ description: 'Plan submitted.' })
  submit(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.submit(id, user.userId);
  }

  @Post('plans/:id/decision')
  @RequirePermissions(PERMISSIONS.TRAINING_APPROVE)
  @AuditLog({ action: 'TRAINING_PLAN_DECISION', entityType: 'TrainingPlan' })
  @ApiOperation({ summary: 'Approve or reject a submitted training plan.' })
  @ApiCreatedResponse({ description: 'Decision recorded.' })
  decide(@Param('id') id: string, @Body() dto: TrainingPlanDecisionDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.decide(id, user.userId, dto);
  }

  // --- Sessions ---
  @Get('sessions')
  @RequireAnyPermission(...VIEW_SESSIONS)
  @ApiOperation({ summary: 'List training sessions.' })
  @ApiOkResponse({ description: 'Sessions returned.' })
  findAllSessions(@CurrentUser() user: RequestUser) {
    return this.trainingService.findAllSessions(user);
  }

  @Get('sessions/:id')
  @RequireAnyPermission(...VIEW_SESSIONS)
  @ApiOperation({ summary: 'Get a training session by ID.' })
  @ApiOkResponse({ description: 'Session returned.' })
  findOneSession(@Param('id') id: string) {
    return this.trainingService.findOneSession(id);
  }

  @Post('sessions')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_SESSION_CREATE', entityType: 'TrainingSession' })
  @ApiOperation({ summary: 'Create a training session.' })
  @ApiCreatedResponse({ description: 'Session created.' })
  createSession(@Body() dto: CreateTrainingSessionDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.createSession(user.userId, dto);
  }

  @Post('sessions/saturday')
  @RequireAnyPermission(...RECORD_ATTENDANCE)
  @AuditLog({ action: 'TRAINING_SESSION_SATURDAY_RESOLVE', entityType: 'TrainingSession' })
  @ApiOperation({ summary: "Get or create a team's Saturday session for a given date." })
  @ApiCreatedResponse({ description: 'Session resolved.' })
  getOrCreateSaturdaySession(@Body() dto: GetOrCreateSaturdaySessionDto) {
    return this.trainingService.getOrCreateSaturdaySession(dto.teamId, dto.date);
  }

  // Search-and-mark: no team selection needed — the player's own team resolves their
  // Saturday session behind the scenes.
  @Post('attendance/mark')
  @RequireAnyPermission(...RECORD_ATTENDANCE)
  @AuditLog({ action: 'TRAINING_ATTENDANCE_RECORD', entityType: 'TrainingSession' })
  @ApiOperation({ summary: "Mark a player's attendance for their own Saturday session." })
  @ApiCreatedResponse({ description: 'Attendance recorded.' })
  quickMarkAttendance(@Body() dto: QuickMarkAttendanceDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.quickMarkAttendance(dto.playerId, user, dto.status);
  }

  @Patch('sessions/:id')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_SESSION_UPDATE', entityType: 'TrainingSession' })
  @ApiOperation({ summary: 'Update a training session.' })
  @ApiOkResponse({ description: 'Session updated.' })
  updateSession(@Param('id') id: string, @Body() dto: UpdateTrainingSessionDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.updateSession(id, user.userId, dto);
  }

  @Post('sessions/:id/attendance')
  @RequireAnyPermission(...RECORD_ATTENDANCE)
  @AuditLog({ action: 'TRAINING_ATTENDANCE_RECORD', entityType: 'TrainingSession' })
  @ApiOperation({ summary: 'Record attendance for a training session.' })
  @ApiCreatedResponse({ description: 'Attendance recorded.' })
  recordAttendance(@Param('id') id: string, @Body() dto: RecordAttendanceDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.recordAttendance(id, user, dto);
  }

  @Post('sessions/:id/activities')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_SESSION_ACTIVITY_CREATE', entityType: 'TrainingSession' })
  @ApiOperation({ summary: 'Add an activity to a training session.' })
  @ApiCreatedResponse({ description: 'Activity added.' })
  addSessionActivity(@Param('id') id: string, @Body() dto: CreateSessionActivityDto, @CurrentUser() user: RequestUser) {
    return this.trainingService.addSessionActivity(id, user, dto);
  }

  @Delete('sessions/:id/activities/:activityId')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_SESSION_ACTIVITY_DELETE', entityType: 'TrainingSession' })
  @ApiOperation({ summary: 'Remove an activity from a training session.' })
  @ApiOkResponse({ description: 'Activity removed.' })
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
  @ApiOperation({ summary: 'Get recorded marks for a training activity.' })
  @ApiOkResponse({ description: 'Marks returned.' })
  getActivityMarks(@Param('activityId') activityId: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.getActivityMarks(activityId, user);
  }

  @Post('activities/:activityId/marks')
  @RequirePermissions(PERMISSIONS.TRAINING_MANAGE_OWN)
  @AuditLog({ action: 'TRAINING_ACTIVITY_MARKS_RECORD', entityType: 'TrainingActivityMark' })
  @ApiOperation({ summary: 'Record marks for a training activity.' })
  @ApiCreatedResponse({ description: 'Marks recorded.' })
  upsertActivityMarks(
    @Param('activityId') activityId: string,
    @Body() dto: UpsertActivityMarksDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.trainingService.upsertActivityMarks(activityId, user, dto);
  }

  @Get('players/:playerId/marks')
  @RequireAnyPermission(...OWN_OR_APPROVE)
  @ApiOperation({ summary: "Get a player's training activity marks." })
  @ApiOkResponse({ description: 'Marks returned.' })
  getPlayerMarks(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.getPlayerMarks(playerId, user);
  }

  @Get('teams/:teamId/marks')
  @RequireAnyPermission(...OWN_OR_APPROVE)
  @ApiOperation({ summary: "Get a team's training activity marks." })
  @ApiOkResponse({ description: 'Marks returned.' })
  getTeamMarks(@Param('teamId') teamId: string, @CurrentUser() user: RequestUser) {
    return this.trainingService.getTeamMarks(teamId, user);
  }
}
