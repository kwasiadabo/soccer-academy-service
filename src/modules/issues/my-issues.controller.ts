import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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
import { CreateIssueDto } from './dto/create-issue.dto';
import { CreateIssueMessageDto } from './dto/create-issue-message.dto';

// Parent-facing: a guardian's own issues, scoped via GuardianContextService.
@ApiTags('parent-portal')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(PERMISSIONS.PARENT_PORTAL_ACCESS)
@Controller('parent-portal/issues')
export class MyIssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  @ApiOperation({ summary: "List the current guardian's issues." })
  @ApiOkResponse({ description: 'Issues returned.' })
  listMine(@CurrentUser() user: RequestUser) {
    return this.issuesService.listMyIssues(user.userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get the count of unread staff replies across the current guardian\'s issues.' })
  @ApiOkResponse({ description: 'Count returned.' })
  unreadCount(@CurrentUser() user: RequestUser) {
    return this.issuesService.unreadCount(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Raise a new issue.' })
  @ApiCreatedResponse({ description: 'Issue created.' })
  @AuditLog({ action: 'ISSUE_CREATE', entityType: 'ParentIssue' })
  create(@Body() dto: CreateIssueDto, @CurrentUser() user: RequestUser) {
    return this.issuesService.createIssue(user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one of the current guardian\'s issues by ID.' })
  @ApiOkResponse({ description: 'Issue returned.' })
  getOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.issuesService.getMyIssue(user.userId, id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add a message to one of the current guardian\'s issues.' })
  @ApiCreatedResponse({ description: 'Message added.' })
  @AuditLog({ action: 'ISSUE_MESSAGE_ADD', entityType: 'ParentIssue' })
  addMessage(
    @Param('id') id: string,
    @Body() dto: CreateIssueMessageDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.issuesService.addMyMessage(user.userId, id, dto.message);
  }
}
