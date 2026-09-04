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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const PRODUCT_INCLUDE = {
    variants: { orderBy: { sizeLabel: 'asc' } },
    images: { orderBy: { sortOrder: 'asc' } },
};
let ProductsService = class ProductsService {
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    findAll(includeInactive = true) {
        return this.prisma.product.findMany({
            where: { deletedAt: null, ...(includeInactive ? {} : { isActive: true }) },
            include: PRODUCT_INCLUDE,
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id, includeInactive = true) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null, ...(includeInactive ? {} : { isActive: true }) },
            include: PRODUCT_INCLUDE,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    create(dto) {
        return this.prisma.product.create({ data: dto, include: PRODUCT_INCLUDE });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.product.update({ where: { id }, data: dto, include: PRODUCT_INCLUDE });
    }
    async addVariant(productId, dto) {
        await this.findOne(productId);
        await this.prisma.productVariant.create({
            data: {
                productId,
                sizeLabel: dto.sizeLabel,
                priceOverride: dto.priceOverride,
                stockQuantity: dto.stockQuantity ?? 0,
            },
        });
        return this.findOne(productId);
    }
    async updateVariant(productId, variantId, dto) {
        const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
        if (!variant || variant.productId !== productId) {
            throw new common_1.NotFoundException('Variant not found');
        }
        await this.prisma.productVariant.update({ where: { id: variantId }, data: dto });
        return this.findOne(productId);
    }
    async addImage(productId, file, uploadedByUserId) {
        if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
            throw new common_1.BadRequestException('Image must be a JPEG, PNG, or WEBP file');
        }
        if (file.size > MAX_IMAGE_BYTES) {
            throw new common_1.BadRequestException('Image must be smaller than 5MB');
        }
        const product = await this.findOne(productId);
        const stored = await this.storage.save(file.originalname, file.mimetype, file.buffer);
        const document = await this.prisma.document.create({
            data: {
                ownerType: client_1.DocumentOwnerType.PRODUCT,
                ownerId: product.id,
                documentType: client_1.DocumentType.PHOTO,
                fileName: stored.fileName,
                storageKey: stored.storageKey,
                mimeType: stored.mimeType,
                sizeBytes: stored.sizeBytes,
                uploadedByUserId,
            },
        });
        const nextSortOrder = product.images.length > 0 ? Math.max(...product.images.map((i) => i.sortOrder)) + 1 : 0;
        await this.prisma.productImage.create({ data: { productId, documentId: document.id, sortOrder: nextSortOrder } });
        return this.findOne(productId);
    }
    async removeImage(productId, imageId) {
        const image = await this.prisma.productImage.findUnique({ where: { id: imageId }, include: { document: true } });
        if (!image || image.productId !== productId) {
            throw new common_1.NotFoundException('Image not found');
        }
        await this.prisma.productImage.delete({ where: { id: imageId } });
        await this.storage.delete(image.document.storageKey).catch(() => undefined);
        await this.prisma.document.delete({ where: { id: image.documentId } }).catch(() => undefined);
        return this.findOne(productId);
    }
    async getImage(productId, imageId) {
        const image = await this.prisma.productImage.findUnique({ where: { id: imageId }, include: { document: true } });
        if (!image || image.productId !== productId) {
            throw new common_1.NotFoundException('Image not found');
        }
        const buffer = await this.storage.read(image.document.storageKey);
        return { buffer, mimeType: image.document.mimeType };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ProductsService);
//# sourceMappingURL=products.service.js.map