import { BadRequestException, Injectable } from '@nestjs/common';
import { GalleryPhotoContext } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 20;

@Injectable()
export class GalleryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async findPublic() {
    const photos = await this.prisma.galleryPhoto.findMany({
      orderBy: [{ context: 'asc' }, { sortOrder: 'asc' }],
    });
    return photos.map((photo) => ({
      id: photo.id,
      context: photo.context,
      url: this.storage.resolvePath(photo.storageKey),
      sessionDate: photo.sessionDate,
      details: photo.details,
      createdAt: photo.createdAt,
    }));
  }

  // Wholesale replace: this week's batch of photos for a context (Saturday training or
  // a match day) fully replaces whatever was there before. New assets are uploaded and
  // committed to the DB first, then the old rows/assets are torn down — so the public
  // gallery is never left empty mid-swap. Cloudinary deletes are best-effort; a failed
  // delete must never roll back the new upload that already succeeded.
  async replaceForContext(
    context: GalleryPhotoContext,
    files: Express.Multer.File[],
    sessionDate: string,
    details: string,
    uploadedByUserId: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one photo is required');
    }
    if (files.length > MAX_FILES_PER_UPLOAD) {
      throw new BadRequestException(`No more than ${MAX_FILES_PER_UPLOAD} photos per upload`);
    }
    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
        throw new BadRequestException('Photos must be JPEG, PNG, or WEBP files');
      }
      if (file.size > MAX_IMAGE_BYTES) {
        throw new BadRequestException('Each photo must be smaller than 5MB');
      }
    }

    const previousPhotos = await this.prisma.galleryPhoto.findMany({ where: { context } });

    const uploaded = await Promise.all(
      files.map((file) => this.storage.save(file.originalname, file.mimetype, file.buffer)),
    );

    await this.prisma.galleryPhoto.createMany({
      data: uploaded.map((stored, index) => ({
        context,
        storageKey: stored.storageKey,
        sortOrder: index,
        sessionDate: new Date(sessionDate),
        details,
        uploadedByUserId,
      })),
    });

    if (previousPhotos.length > 0) {
      await this.prisma.galleryPhoto.deleteMany({ where: { id: { in: previousPhotos.map((p) => p.id) } } });
      await Promise.all(previousPhotos.map((photo) => this.storage.delete(photo.storageKey).catch(() => undefined)));
    }

    return this.findPublic();
  }
}
