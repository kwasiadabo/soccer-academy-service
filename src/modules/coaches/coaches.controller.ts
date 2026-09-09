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
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { CoachesService } from './coaches.service';
import { CreateCoachDto, UpdateCoachDto } from './dto/coach.dto';
import { GrantCoachPortalAccessDto } from './dto/grant-portal-access.dto';
import { CreateCoachQualificationDto } from './dto/coach-qualification.dto';
import { CreateCoachAssignmentDto, EndCoachAssignmentDto } from './dto/coach-assignment.dto';

@ApiTags('coaches')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @ApiOperation({ summary: 'List coaches, optionally filtered by search text.' })
  @ApiOkResponse({ description: 'Coaches returned.' })
  findAll(@Query('search') search?: string) {
    return this.coachesService.findAll(search);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @ApiOperation({ summary: 'Get a coach by ID.' })
  @ApiOkResponse({ description: 'Coach returned.' })
  findOne(@Param('id') id: string) {
    return this.coachesService.findOne(id);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_CREATE', entityType: 'Coach' })
  @ApiOperation({ summary: 'Create a coach.' })
  @ApiCreatedResponse({ description: 'Coach created.' })
  create(@Body() dto: CreateCoachDto) {
    return this.coachesService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_UPDATE', entityType: 'Coach' })
  @ApiOperation({ summary: 'Update a coach.' })
  @ApiOkResponse({ description: 'Coach updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateCoachDto) {
    return this.coachesService.update(id, dto);
  }

  @Post(':id/portal-access')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @ApiOperation({ summary: 'Create or link a login for this coach and send a password-reset link' })
  @ApiCreatedResponse({ description: 'Portal access granted.' })
  @AuditLog({ action: 'COACH_PORTAL_ACCESS_GRANT', entityType: 'Coach' })
  grantPortalAccess(@Param('id') id: string, @Body() dto: GrantCoachPortalAccessDto) {
    return this.coachesService.grantPortalAccess(id, dto);
  }

  @Post(':id/qualifications')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_QUALIFICATION_CREATE', entityType: 'Coach' })
  @ApiOperation({ summary: 'Add a qualification to a coach.' })
  @ApiCreatedResponse({ description: 'Qualification added.' })
  addQualification(@Param('id') id: string, @Body() dto: CreateCoachQualificationDto) {
    return this.coachesService.addQualification(id, dto);
  }

  @Post(':id/assignments')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_ASSIGNMENT_CREATE', entityType: 'Coach' })
  @ApiOperation({ summary: 'Assign a coach to a team.' })
  @ApiCreatedResponse({ description: 'Assignment created.' })
  addAssignment(@Param('id') id: string, @Body() dto: CreateCoachAssignmentDto) {
    return this.coachesService.addAssignment(id, dto);
  }

  @Patch(':id/assignments/:assignmentId')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_ASSIGNMENT_END', entityType: 'Coach' })
  @ApiOperation({ summary: 'End a coach assignment.' })
  @ApiOkResponse({ description: 'Assignment ended.' })
  endAssignment(
    @Param('id') id: string,
    @Param('assignmentId') assignmentId: string,
    @Body() dto: EndCoachAssignmentDto,
  ) {
    return this.coachesService.endAssignment(id, assignmentId, dto);
  }
}
