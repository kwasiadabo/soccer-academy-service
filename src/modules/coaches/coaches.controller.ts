import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  findAll(@Query('search') search?: string) {
    return this.coachesService.findAll(search);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  findOne(@Param('id') id: string) {
    return this.coachesService.findOne(id);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_CREATE', entityType: 'Coach' })
  create(@Body() dto: CreateCoachDto) {
    return this.coachesService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_UPDATE', entityType: 'Coach' })
  update(@Param('id') id: string, @Body() dto: UpdateCoachDto) {
    return this.coachesService.update(id, dto);
  }

  @Post(':id/portal-access')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @ApiOperation({ summary: 'Create or link a login for this coach and send a password-reset link' })
  @AuditLog({ action: 'COACH_PORTAL_ACCESS_GRANT', entityType: 'Coach' })
  grantPortalAccess(@Param('id') id: string, @Body() dto: GrantCoachPortalAccessDto) {
    return this.coachesService.grantPortalAccess(id, dto);
  }

  @Post(':id/qualifications')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_QUALIFICATION_CREATE', entityType: 'Coach' })
  addQualification(@Param('id') id: string, @Body() dto: CreateCoachQualificationDto) {
    return this.coachesService.addQualification(id, dto);
  }

  @Post(':id/assignments')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_ASSIGNMENT_CREATE', entityType: 'Coach' })
  addAssignment(@Param('id') id: string, @Body() dto: CreateCoachAssignmentDto) {
    return this.coachesService.addAssignment(id, dto);
  }

  @Patch(':id/assignments/:assignmentId')
  @RequirePermissions(PERMISSIONS.COACHES_MANAGE)
  @AuditLog({ action: 'COACH_ASSIGNMENT_END', entityType: 'Coach' })
  endAssignment(
    @Param('id') id: string,
    @Param('assignmentId') assignmentId: string,
    @Body() dto: EndCoachAssignmentDto,
  ) {
    return this.coachesService.endAssignment(id, assignmentId, dto);
  }
}
