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
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
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
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string): Promise<{
        images: {
            id: string;
            createdAt: Date;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
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
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    getImage(id: string, imageId: string, res: Response): Promise<void>;
    create(dto: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
        images: {
            id: string;
            createdAt: Date;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
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
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateProductDto): Promise<{
        images: {
            id: string;
            createdAt: Date;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
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
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    addVariant(id: string, dto: CreateVariantDto): Promise<{
        images: {
            id: string;
            createdAt: Date;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
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
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateVariant(id: string, variantId: string, dto: UpdateVariantDto): Promise<{
        images: {
            id: string;
            createdAt: Date;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
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
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    addImage(id: string, file: Express.Multer.File, user: RequestUser): Promise<{
        images: {
            id: string;
            createdAt: Date;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
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
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeImage(id: string, imageId: string): Promise<{
        images: {
            id: string;
            createdAt: Date;
            sortOrder: number;
            productId: string;
            documentId: string;
        }[];
        variants: {
            id: string;
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
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    }>;
}
