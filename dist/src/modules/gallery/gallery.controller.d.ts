import { GalleryPhotoContext } from '@prisma/client';
import { RequestUser } from '../auth/types';
import { GalleryService } from './gallery.service';
import { ReplaceGalleryPhotosDto } from './dto/replace-gallery-photos.dto';
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    getPublic(): Promise<{
        id: string;
        context: import(".prisma/client").$Enums.GalleryPhotoContext;
        url: string;
        sessionDate: Date;
        details: string;
        createdAt: Date;
    }[]>;
    replacePhotos(context: GalleryPhotoContext, files: Express.Multer.File[], dto: ReplaceGalleryPhotosDto, user: RequestUser): Promise<{
        id: string;
        context: import(".prisma/client").$Enums.GalleryPhotoContext;
        url: string;
        sessionDate: Date;
        details: string;
        createdAt: Date;
    }[]>;
}
