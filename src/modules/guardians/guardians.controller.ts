import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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
import { GuardiansService } from './guardians.service';
import { GrantGuardianPortalAccessDto } from './dto/grant-portal-access.dto';

@ApiTags('guardians')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.PLAYERS_MANAGE)
  @ApiOperation({ summary: 'List guardians, optionally filtered by search text.' })
  @ApiOkResponse({ description: 'Guardians returned.' })
  findAll(@Query('search') search?: string) {
    return this.guardiansService.findAll(search);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.PLAYERS_MANAGE)
  @ApiOperation({ summary: 'Get a guardian by ID.' })
  @ApiOkResponse({ description: 'Guardian returned.' })
  findOne(@Param('id') id: string) {
    return this.guardiansService.findOne(id);
  }

  @Post(':id/portal-access')
  @RequirePermissions(PERMISSIONS.PLAYERS_MANAGE)
  @ApiOperation({ summary: 'Create or link a login for this guardian and send a password-reset link' })
  @ApiCreatedResponse({ description: 'Portal access granted.' })
  @AuditLog({ action: 'GUARDIAN_PORTAL_ACCESS_GRANT', entityType: 'Guardian' })
  grantPortalAccess(@Param('id') id: string, @Body() dto: GrantGuardianPortalAccessDto) {
    return this.guardiansService.grantPortalAccess(id, dto);
  }
}
