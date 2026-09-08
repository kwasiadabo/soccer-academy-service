import type { Response } from 'express';
import { ProductsService } from './products.service';
import { MerchandiseOrdersService } from './merchandise-orders.service';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';
export declare class PublicShopController {
    private readonly productsService;
    private readonly ordersService;
    constructor(productsService: ProductsService, ordersService: MerchandiseOrdersService);
    listProducts(): import(".prisma/client").Prisma.PrismaPromise<({
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
    getProduct(id: string): Promise<{
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
    getProductImage(id: string, imageId: string, res: Response): Promise<void>;
    lookupPlayer(code: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        team: {
            name: string;
        } | null;
    }>;
    createOrder(dto: CreateGuestOrderDto): Promise<{
        items: ({
            productVariant: {
                product: {
                    images: {
                        id: string;
                        createdAt: Date;
                        sortOrder: number;
                        productId: string;
                        documentId: string;
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
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: import("@prisma/client/runtime/library").Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: import("@prisma/client/runtime/library").Decimal;
            lineTotal: import("@prisma/client/runtime/library").Decimal;
        })[];
        player: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
        };
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        invoice: {
            id: string;
            description: string | null;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            amount: import("@prisma/client/runtime/library").Decimal;
            allocations: {
                amount: import("@prisma/client/runtime/library").Decimal;
            }[];
            invoiceNumber: string;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            dueDate: Date;
        } | null;
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        playerId: string;
        guardianId: string;
        invoiceId: string | null;
        submittedByUserId: string | null;
        guestName: string | null;
        guestPhone: string | null;
        guestEmail: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        staffNotes: string | null;
    }>;
}
