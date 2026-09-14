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
            academyId: string;
            sortOrder: number;
            documentId: string;
            productId: string;
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
        description: string | null;
        academyId: string;
        deletedAt: Date | null;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ProductCategory;
        basePrice: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    getProduct(id: string): Promise<{
        images: {
            id: string;
            createdAt: Date;
            academyId: string;
            sortOrder: number;
            documentId: string;
            productId: string;
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
        description: string | null;
        academyId: string;
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
            status: import(".prisma/client").$Enums.InvoiceStatus;
            description: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceNumber: string;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            dueDate: Date;
            allocations: {
                amount: import("@prisma/client/runtime/library").Decimal;
            }[];
        } | null;
        items: ({
            productVariant: {
                product: {
                    images: {
                        id: string;
                        createdAt: Date;
                        academyId: string;
                        sortOrder: number;
                        documentId: string;
                        productId: string;
                    }[];
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    academyId: string;
                    deletedAt: Date | null;
                    isActive: boolean;
                    category: import(".prisma/client").$Enums.ProductCategory;
                    basePrice: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: import("@prisma/client/runtime/library").Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: import("@prisma/client/runtime/library").Decimal;
            lineTotal: import("@prisma/client/runtime/library").Decimal;
        })[];
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
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
