import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { ParentPortalService } from './parent-portal.service';
import { CreateCoachFeedbackDto } from './dto/coach-feedback.dto';

@ApiTags('parent-portal')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(PERMISSIONS.PARENT_PORTAL_ACCESS)
@Controller('parent-portal')
export class ParentPortalController {
  constructor(private readonly parentPortalService: ParentPortalService) {}

  @Get('children')
  @ApiOperation({ summary: "List the current guardian's children." })
  @ApiOkResponse({ description: 'Children returned.' })
  listChildren(@CurrentUser() user: RequestUser) {
    return this.parentPortalService.listChildren(user.userId);
  }

  @Get('player-of-the-week')
  @ApiOperation({ summary: "List Player of the Week awards for the current guardian's children." })
  @ApiOkResponse({ description: 'Awards returned.' })
  getPlayerOfTheWeekAwards(@CurrentUser() user: RequestUser) {
    return this.parentPortalService.getPlayerOfTheWeekAwards(user.userId);
  }

  @Get('children/:playerId')
  @ApiOperation({ summary: "Get one of the current guardian's children by player ID." })
  @ApiOkResponse({ description: 'Child returned.' })
  getChild(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getChild(user.userId, playerId);
  }

  @Get('children/:playerId/photo')
  @ApiOperation({ summary: "Get a child's photo (binary response)." })
  @ApiOkResponse({ description: 'Image bytes returned.' })
  async getPhoto(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser, @Res() res: Response) {
    const { buffer, mimeType } = await this.parentPortalService.getPhoto(user.userId, playerId);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.send(buffer);
  }

  @Get('children/:playerId/attendance')
  @ApiOperation({ summary: "Get a child's attendance record." })
  @ApiOkResponse({ description: 'Attendance returned.' })
  getAttendance(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getAttendance(user.userId, playerId);
  }

  @Get('children/:playerId/assessments')
  @ApiOperation({ summary: "Get a child's assessments." })
  @ApiOkResponse({ description: 'Assessments returned.' })
  getAssessments(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getAssessments(user.userId, playerId);
  }

  @Get('children/:playerId/activity-marks')
  @ApiOperation({ summary: "Get a child's training activity marks." })
  @ApiOkResponse({ description: 'Activity marks returned.' })
  getActivityMarks(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getActivityMarks(user.userId, playerId);
  }

  @Get('children/:playerId/coaches')
  @ApiOperation({ summary: "Get a child's assigned coaches." })
  @ApiOkResponse({ description: 'Coaches returned.' })
  getCoaches(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getCoaches(user.userId, playerId);
  }

  @Get('children/:playerId/matches')
  @ApiOperation({ summary: "Get a child's match history." })
  @ApiOkResponse({ description: 'Matches returned.' })
  getMatches(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getMatches(user.userId, playerId);
  }

  @Get('children/:playerId/finance-summary')
  @ApiOperation({ summary: "Get a child's finance summary." })
  @ApiOkResponse({ description: 'Summary returned.' })
  getFinanceSummary(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getFinanceSummary(user.userId, playerId);
  }

  @Get('children/:playerId/statement')
  @ApiOperation({ summary: "Get a child's billing statement." })
  @ApiOkResponse({ description: 'Statement returned.' })
  getStatement(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getStatement(user.userId, playerId);
  }

  @Post('children/:playerId/feedback')
  @ApiOperation({ summary: 'Submit feedback to a coach about a child.' })
  @ApiCreatedResponse({ description: 'Feedback submitted.' })
  @AuditLog({ action: 'COACH_FEEDBACK_SUBMIT', entityType: 'CoachFeedback' })
  submitFeedback(
    @Param('playerId') playerId: string,
    @Body() dto: CreateCoachFeedbackDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.parentPortalService.submitFeedback(user.userId, playerId, dto);
  }
}
