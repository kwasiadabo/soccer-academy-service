import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(PERMISSIONS.PARENT_PORTAL_ACCESS)
@Controller('parent-portal')
export class ParentPortalController {
  constructor(private readonly parentPortalService: ParentPortalService) {}

  @Get('children')
  listChildren(@CurrentUser() user: RequestUser) {
    return this.parentPortalService.listChildren(user.userId);
  }

  @Get('player-of-the-week')
  getPlayerOfTheWeekAwards(@CurrentUser() user: RequestUser) {
    return this.parentPortalService.getPlayerOfTheWeekAwards(user.userId);
  }

  @Get('children/:playerId')
  getChild(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getChild(user.userId, playerId);
  }

  @Get('children/:playerId/photo')
  async getPhoto(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser, @Res() res: Response) {
    const { buffer, mimeType } = await this.parentPortalService.getPhoto(user.userId, playerId);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.send(buffer);
  }

  @Get('children/:playerId/attendance')
  getAttendance(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getAttendance(user.userId, playerId);
  }

  @Get('children/:playerId/assessments')
  getAssessments(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getAssessments(user.userId, playerId);
  }

  @Get('children/:playerId/activity-marks')
  getActivityMarks(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getActivityMarks(user.userId, playerId);
  }

  @Get('children/:playerId/coaches')
  getCoaches(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getCoaches(user.userId, playerId);
  }

  @Get('children/:playerId/matches')
  getMatches(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getMatches(user.userId, playerId);
  }

  @Get('children/:playerId/finance-summary')
  getFinanceSummary(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getFinanceSummary(user.userId, playerId);
  }

  @Get('children/:playerId/statement')
  getStatement(@Param('playerId') playerId: string, @CurrentUser() user: RequestUser) {
    return this.parentPortalService.getStatement(user.userId, playerId);
  }

  @Post('children/:playerId/feedback')
  @AuditLog({ action: 'COACH_FEEDBACK_SUBMIT', entityType: 'CoachFeedback' })
  submitFeedback(
    @Param('playerId') playerId: string,
    @Body() dto: CreateCoachFeedbackDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.parentPortalService.submitFeedback(user.userId, playerId, dto);
  }
}
