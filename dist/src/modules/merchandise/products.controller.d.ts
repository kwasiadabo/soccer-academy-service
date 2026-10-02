import type { Response } from 'express';
import { RequestUser } from '../auth/types';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        images: {
            id: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        academyId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    })[]>;
    findOne(id: string): Promise<{
        images: {
            id: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        academyId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }>;
    getImage(id: string, imageId: string, res: Response): Promise<void>;
    create(dto: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
        images: {
            id: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        academyId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateProductDto): Promise<{
        images: {
            id: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        academyId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }>;
    addVariant(id: string, dto: CreateVariantDto): Promise<{
        images: {
            id: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        academyId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }>;
    updateVariant(id: string, variantId: string, dto: UpdateVariantDto): Promise<{
        images: {
            id: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        academyId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }>;
    addImage(id: string, file: Express.Multer.File, user: RequestUser): Promise<{
        images: {
            id: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        academyId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }>;
    removeImage(id: string, imageId: string): Promise<{
        images: {
            id: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            productId: string;
            sizeLabel: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        academyId: string;
        description: string | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }>;
}
