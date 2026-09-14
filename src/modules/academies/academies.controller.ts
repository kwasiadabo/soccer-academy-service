import { Body, Controller, Get, NotFoundException, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { AcademiesService } from './academies.service';
import { UpdateAcademySettingsDto } from './dto/update-academy-settings.dto';

// Phase-1 verification endpoint: confirms the tenant-resolution middleware
// correctly resolved an Academy from the request and made it readable via
// TenantContextService, before anything else in the app depends on it.
// Deliberately unauthenticated — there's no tenant claim in the JWT yet.
@ApiTags('academies')
@Controller('academies')
export class AcademiesController {
  constructor(
    private readonly academies: AcademiesService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Get('whoami')
  @ApiOperation({ summary: 'Debug: report which academy the current request resolved to.' })
  @ApiOkResponse({ description: 'The resolved academy.' })
  async whoami() {
    const academyId = this.tenantContext.getAcademyId();
    const academy = await this.academies.findById(academyId);
    if (!academy) {
      throw new NotFoundException('Resolved academyId does not match any academy');
    }
    return academy;
  }

  // Public marketing/login-screen branding — unauthenticated by design, same as
  // the app's other `*/public` endpoints (gallery, player-of-the-week).
  @Get('public')
  @ApiOperation({ summary: "Get the current academy's public branding (unauthenticated)." })
  @ApiOkResponse({ description: 'Branding returned.' })
  getPublicBranding() {
    return this.academies.getPublicBranding();
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_VIEW)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  @ApiOperation({ summary: "Get this academy's own branding settings." })
  @ApiOkResponse({ description: 'Settings returned.' })
  getSettings() {
    return this.academies.getSettings();
  }

  // POST, not PATCH: every other multipart/file-accepting endpoint in this
  // app (coach/product images, player photos, gallery) is POST — the web
  // client's apiUpload() helper only ever sends POST, so this matches rather
  // than introducing a one-off method override just for this route.
  @Post('settings')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.ACADEMY_CONFIG_MANAGE)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiOperation({ summary: "Update this academy's brand name and/or logo." })
  @ApiOkResponse({ description: 'Settings updated.' })
  updateSettings(@Body() dto: UpdateAcademySettingsDto, @UploadedFile() logo?: Express.Multer.File) {
    return this.academies.updateSettings(dto, logo);
  }
}
