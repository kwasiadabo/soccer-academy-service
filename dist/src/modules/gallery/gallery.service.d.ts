import { GalleryPhotoContext } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { StorageService } from '../storage/storage.service';
export declare class GalleryService {
    private readonly prisma;
    private readonly storage;
    private readonly tenantContext;
    constructor(prisma: PrismaService, storage: StorageService, tenantContext: TenantContextService);
    findPublic(): Promise<{
        id: string;
        context: import(".prisma/client").$Enums.GalleryPhotoContext;
        url: string;
        sessionDate: Date;
        details: string;
        createdAt: Date;
    }[]>;
    replaceForContext(context: GalleryPhotoContext, files: Express.Multer.File[], sessionDate: string, details: string, uploadedByUserId: string): Promise<{
        id: string;
        context: import(".prisma/client").$Enums.GalleryPhotoContext;
        url: string;
        sessionDate: Date;
        details: string;
        createdAt: Date;
    }[]>;
}
