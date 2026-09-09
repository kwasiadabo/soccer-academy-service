import { Body, Controller, Get, Param, ParseEnumPipe, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GalleryPhotoContext } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types';
import { PERMISSIONS } from '../rbac/permissions.constants';
import { AuditLog } from '../audit/audit-log.decorator';
import { GalleryService } from './gallery.service';
import { ReplaceGalleryPhotosDto } from './dto/replace-gallery-photos.dto';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // Public marketing-site gallery feed — unauthenticated by design.
  @Get('public')
  @ApiOperation({ summary: 'List public gallery photos (unauthenticated).' })
  @ApiOkResponse({ description: 'Photos returned.' })
  getPublic() {
    return this.galleryService.findPublic();
  }

  @Post(':context/photos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.GALLERY_MANAGE)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiOperation({ summary: 'Replace all gallery photos for a context (e.g. a training session).' })
  @ApiCreatedResponse({ description: 'Photos replaced.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
  @ApiForbiddenResponse({ description: 'Caller lacks the required permission.' })
  @AuditLog({ action: 'GALLERY_PHOTOS_REPLACE', entityType: 'GalleryPhoto' })
  replacePhotos(
    @Param('context', new ParseEnumPipe(GalleryPhotoContext)) context: GalleryPhotoContext,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: ReplaceGalleryPhotosDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.galleryService.replaceForContext(context, files, dto.sessionDate, dto.details, user.userId);
  }
}
