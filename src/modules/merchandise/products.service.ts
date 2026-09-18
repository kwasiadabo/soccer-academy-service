import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentOwnerType, DocumentType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { StorageService } from '../storage/storage.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const PRODUCT_INCLUDE = {
  variants: { orderBy: { sizeLabel: 'asc' as const } },
  images: { orderBy: { sortOrder: 'asc' as const } },
} as const;

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly tenantContext: TenantContextService,
  ) {}

  findAll(includeInactive = true) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.product.findMany({
      where: { academyId, deletedAt: null, ...(includeInactive ? {} : { isActive: true }) },
      include: PRODUCT_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, includeInactive = true) {
    const academyId = this.tenantContext.getAcademyId();
    const product = await this.prisma.product.findFirst({
      where: { id, academyId, deletedAt: null, ...(includeInactive ? {} : { isActive: true }) },
      include: PRODUCT_INCLUDE,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  create(dto: CreateProductDto) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.product.create({ data: { ...dto, academyId }, include: PRODUCT_INCLUDE });
  }

  async update(id: string, dto: UpdateProductDto) {
    const academyId = this.tenantContext.getAcademyId();
    await this.findOne(id);
    return this.prisma.product.update({ where: { id, academyId }, data: dto, include: PRODUCT_INCLUDE });
  }

  async addVariant(productId: string, dto: CreateVariantDto) {
    const academyId = this.tenantContext.getAcademyId();
    await this.findOne(productId);
    await this.prisma.productVariant.create({
      data: {
        academyId,
        productId,
        sizeLabel: dto.sizeLabel,
        priceOverride: dto.priceOverride,
        stockQuantity: dto.stockQuantity ?? 0,
      },
    });
    return this.findOne(productId);
  }

  async updateVariant(productId: string, variantId: string, dto: UpdateVariantDto) {
    const academyId = this.tenantContext.getAcademyId();
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, productId, academyId },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    await this.prisma.productVariant.update({ where: { id: variantId, academyId }, data: dto });
    return this.findOne(productId);
  }

  // A product can carry several photos (front/back/detail shots) so the shop can show
  // "different sides" of the merchandise — each upload appends to the gallery rather
  // than replacing a single cover image. sortOrder[0] is the catalog-grid cover.
  async addImage(productId: string, file: Express.Multer.File, uploadedByUserId: string) {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Image must be a JPEG, PNG, or WEBP file');
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new BadRequestException('Image must be smaller than 5MB');
    }

    const product = await this.findOne(productId);
    const stored = await this.storage.save(file.originalname, file.mimetype, file.buffer);

    const document = await this.prisma.document.create({
      data: {
        academyId: product.academyId,
        ownerType: DocumentOwnerType.PRODUCT,
        ownerId: product.id,
        documentType: DocumentType.PHOTO,
        fileName: stored.fileName,
        storageKey: stored.storageKey,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        uploadedByUserId,
      },
    });

    const nextSortOrder = product.images.length > 0 ? Math.max(...product.images.map((i) => i.sortOrder)) + 1 : 0;
    await this.prisma.productImage.create({
      data: { academyId: product.academyId, productId, documentId: document.id, sortOrder: nextSortOrder },
    });

    return this.findOne(productId);
  }

  async removeImage(productId: string, imageId: string) {
    const academyId = this.tenantContext.getAcademyId();
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId, academyId },
      include: { document: true },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    await this.prisma.productImage.delete({ where: { id: imageId, academyId } });
    await this.storage.delete(image.document.storageKey).catch(() => undefined);
    await this.prisma.document.delete({ where: { id: image.documentId, academyId } }).catch(() => undefined);
    return this.findOne(productId);
  }

  async getImage(productId: string, imageId: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const academyId = this.tenantContext.getAcademyId();
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId, academyId },
      include: { document: true },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    const buffer = await this.storage.read(image.document.storageKey);
    return { buffer, mimeType: image.document.mimeType };
  }
}
