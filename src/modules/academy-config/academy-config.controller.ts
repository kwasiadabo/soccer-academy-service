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
import { RequireAnyPermission, RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { AcademyConfigService } from './academy-config.service';
import { CreateSeasonDto, UpdateSeasonDto } from './dto/season.dto';
import { CreateAgeCategoryDto, UpdateAgeCategoryDto } from './dto/age-category.dto';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { CreateTrainingGroupDto, UpdateTrainingGroupDto } from './dto/training-group.dto';

@ApiTags('academy-config')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('academy-config')
export class AcademyConfigController {
  constructor(private readonly service: AcademyConfigService) {}

  // Seasons
  @Get('seasons')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_VIEW)
  @ApiOperation({ summary: 'List all seasons.' })
  @ApiOkResponse({ description: 'Seasons returned.' })
  listSeasons() {
    return this.service.listSeasons();
  }

  @Post('seasons')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_MANAGE)
  @AuditLog({ action: 'SEASON_CREATE', entityType: 'Season' })
  @ApiOperation({ summary: 'Create a season.' })
  @ApiCreatedResponse({ description: 'Season created.' })
  createSeason(@Body() dto: CreateSeasonDto) {
    return this.service.createSeason(dto);
  }

  @Patch('seasons/:id')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_MANAGE)
  @AuditLog({ action: 'SEASON_UPDATE', entityType: 'Season' })
  @ApiOperation({ summary: 'Update a season.' })
  @ApiOkResponse({ description: 'Season updated.' })
  updateSeason(@Param('id') id: string, @Body() dto: UpdateSeasonDto) {
    return this.service.updateSeason(id, dto);
  }

  // Age Categories
  @Get('age-categories')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_VIEW)
  @ApiOperation({ summary: 'List all age categories.' })
  @ApiOkResponse({ description: 'Age categories returned.' })
  listAgeCategories() {
    return this.service.listAgeCategories();
  }

  @Post('age-categories')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_MANAGE)
  @AuditLog({ action: 'AGE_CATEGORY_CREATE', entityType: 'AgeCategory' })
  @ApiOperation({ summary: 'Create an age category.' })
  @ApiCreatedResponse({ description: 'Age category created.' })
  createAgeCategory(@Body() dto: CreateAgeCategoryDto) {
    return this.service.createAgeCategory(dto);
  }

  @Patch('age-categories/:id')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_MANAGE)
  @AuditLog({ action: 'AGE_CATEGORY_UPDATE', entityType: 'AgeCategory' })
  @ApiOperation({ summary: 'Update an age category.' })
  @ApiOkResponse({ description: 'Age category updated.' })
  updateAgeCategory(@Param('id') id: string, @Body() dto: UpdateAgeCategoryDto) {
    return this.service.updateAgeCategory(id, dto);
  }

  // Teams
  @Get('teams')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_VIEW)
  @ApiOperation({ summary: 'List all teams.' })
  @ApiOkResponse({ description: 'Teams returned.' })
  listTeams() {
    return this.service.listTeams();
  }

  @Post('teams')
  @RequireAnyPermission(PERMISSIONS.ACADEMY_CONFIG_MANAGE, PERMISSIONS.TEAMS_MANAGE)
  @AuditLog({ action: 'TEAM_CREATE', entityType: 'Team' })
  @ApiOperation({ summary: 'Create a team.' })
  @ApiCreatedResponse({ description: 'Team created.' })
  createTeam(@Body() dto: CreateTeamDto) {
    return this.service.createTeam(dto);
  }

  @Patch('teams/:id')
  @RequireAnyPermission(PERMISSIONS.ACADEMY_CONFIG_MANAGE, PERMISSIONS.TEAMS_MANAGE)
  @AuditLog({ action: 'TEAM_UPDATE', entityType: 'Team' })
  @ApiOperation({ summary: 'Update a team.' })
  @ApiOkResponse({ description: 'Team updated.' })
  updateTeam(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.service.updateTeam(id, dto);
  }

  // Training Groups
  @Get('training-groups')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_VIEW)
  @ApiOperation({ summary: 'List all training groups.' })
  @ApiOkResponse({ description: 'Training groups returned.' })
  listTrainingGroups() {
    return this.service.listTrainingGroups();
  }

  @Post('training-groups')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_MANAGE)
  @AuditLog({ action: 'TRAINING_GROUP_CREATE', entityType: 'TrainingGroup' })
  @ApiOperation({ summary: 'Create a training group.' })
  @ApiCreatedResponse({ description: 'Training group created.' })
  createTrainingGroup(@Body() dto: CreateTrainingGroupDto) {
    return this.service.createTrainingGroup(dto);
  }

  @Patch('training-groups/:id')
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_MANAGE)
  @AuditLog({ action: 'TRAINING_GROUP_UPDATE', entityType: 'TrainingGroup' })
  @ApiOperation({ summary: 'Update a training group.' })
  @ApiOkResponse({ description: 'Training group updated.' })
  updateTrainingGroup(@Param('id') id: string, @Body() dto: UpdateTrainingGroupDto) {
    return this.service.updateTrainingGroup(id, dto);
  }
}
