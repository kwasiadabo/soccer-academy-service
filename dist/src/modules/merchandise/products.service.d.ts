import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { StorageService } from '../storage/storage.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
export declare class ProductsService {
    private readonly prisma;
    private readonly storage;
    private readonly tenantContext;
    constructor(prisma: PrismaService, storage: StorageService, tenantContext: TenantContextService);
    findAll(includeInactive?: boolean): import(".prisma/client").Prisma.PrismaPromise<({
        images: {
            id: string;
            academyId: string;
            createdAt: Date;
            sortOrder: number;
            documentId: string;
            productId: string;
        }[];
        variants: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string, includeInactive?: boolean): Promise<{
        images: {
            id: string;
            academyId: string;
            createdAt: Date;
            sortOrder: number;
            documentId: string;
            productId: string;
        }[];
        variants: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(dto: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
        images: {
            id: string;
            academyId: string;
            createdAt: Date;
            sortOrder: number;
            documentId: string;
            productId: string;
        }[];
        variants: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateProductDto): Promise<{
        images: {
            id: string;
            academyId: string;
            createdAt: Date;
            sortOrder: number;
            documentId: string;
            productId: string;
        }[];
        variants: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    addVariant(productId: string, dto: CreateVariantDto): Promise<{
        images: {
            id: string;
            academyId: string;
            createdAt: Date;
            sortOrder: number;
            documentId: string;
            productId: string;
        }[];
        variants: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateVariant(productId: string, variantId: string, dto: UpdateVariantDto): Promise<{
        images: {
            id: string;
            academyId: string;
            createdAt: Date;
            sortOrder: number;
            documentId: string;
            productId: string;
        }[];
        variants: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    addImage(productId: string, file: Express.Multer.File, uploadedByUserId: string): Promise<{
        images: {
            id: string;
            academyId: string;
            createdAt: Date;
            sortOrder: number;
            documentId: string;
            productId: string;
        }[];
        variants: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeImage(productId: string, imageId: string): Promise<{
        images: {
            id: string;
            academyId: string;
            createdAt: Date;
            sortOrder: number;
            documentId: string;
            productId: string;
        }[];
        variants: {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    getImage(productId: string, imageId: string): Promise<{
        buffer: Buffer;
        mimeType: string;
    }>;
}
