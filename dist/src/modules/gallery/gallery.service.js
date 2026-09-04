"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 20;
let GalleryService = class GalleryService {
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
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
    async replaceForContext(context, files, sessionDate, details, uploadedByUserId) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('At least one photo is required');
        }
        if (files.length > MAX_FILES_PER_UPLOAD) {
            throw new common_1.BadRequestException(`No more than ${MAX_FILES_PER_UPLOAD} photos per upload`);
        }
        for (const file of files) {
            if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
                throw new common_1.BadRequestException('Photos must be JPEG, PNG, or WEBP files');
            }
            if (file.size > MAX_IMAGE_BYTES) {
                throw new common_1.BadRequestException('Each photo must be smaller than 5MB');
            }
        }
        const previousPhotos = await this.prisma.galleryPhoto.findMany({ where: { context } });
        const uploaded = await Promise.all(files.map((file) => this.storage.save(file.originalname, file.mimetype, file.buffer)));
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
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map