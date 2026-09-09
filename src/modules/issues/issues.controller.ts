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
import { IssuesService } from './issues.service';
import { CreateIssueMessageDto } from './dto/create-issue-message.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';

// Staff-facing: every parent-raised issue, gated by ISSUES_MANAGE
// (Admin, Receptionist, Head Coach).
@ApiTags('issues')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(PERMISSIONS.ISSUES_MANAGE)
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  @ApiOperation({ summary: 'List all parent-raised issues.' })
  @ApiOkResponse({ description: 'Issues returned.' })
  listAll() {
    return this.issuesService.listAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an issue by ID, including its message thread.' })
  @ApiOkResponse({ description: 'Issue returned.' })
  getOne(@Param('id') id: string) {
    return this.issuesService.getForStaff(id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Reply to an issue as staff.' })
  @ApiCreatedResponse({ description: 'Message added.' })
  @AuditLog({ action: 'ISSUE_STAFF_REPLY', entityType: 'ParentIssue' })
  addMessage(
    @Param('id') id: string,
    @Body() dto: CreateIssueMessageDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.issuesService.addStaffMessage(user.userId, id, dto.message);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of an issue.' })
  @ApiOkResponse({ description: 'Issue updated.' })
  @AuditLog({ action: 'ISSUE_STATUS_UPDATE', entityType: 'ParentIssue' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateIssueStatusDto) {
    return this.issuesService.updateStatus(id, dto.status);
  }
}
