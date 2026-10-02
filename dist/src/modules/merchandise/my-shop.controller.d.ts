import type { Response } from 'express';
import { RequestUser } from '../auth/types';
import { ProductsService } from './products.service';
import { MerchandiseOrdersService } from './merchandise-orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class MyShopController {
    private readonly productsService;
    private readonly ordersService;
    constructor(productsService: ProductsService, ordersService: MerchandiseOrdersService);
    listProducts(): import(".prisma/client").Prisma.PrismaPromise<({
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
    getProduct(id: string): Promise<{
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
    getProductImage(id: string, imageId: string, res: Response): Promise<void>;
    listMyOrders(user: RequestUser): Promise<({
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        player: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
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
                        productId: string;
                        documentId: string;
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
    } & {
        id: string;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        guardianId: string;
        submittedByUserId: string | null;
        guestName: string | null;
        guestPhone: string | null;
        guestEmail: string | null;
        playerId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        invoiceId: string | null;
        staffNotes: string | null;
    })[]>;
    getMyOrder(id: string, user: RequestUser): Promise<{
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        player: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
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
                        productId: string;
                        documentId: string;
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
    } & {
        id: string;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        guardianId: string;
        submittedByUserId: string | null;
        guestName: string | null;
        guestPhone: string | null;
        guestEmail: string | null;
        playerId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        invoiceId: string | null;
        staffNotes: string | null;
    }>;
    createOrder(dto: CreateOrderDto, user: RequestUser): Promise<{
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        player: {
            id: string;
            firstName: string;
            lastName: string;
            playerCode: string | null;
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
                        productId: string;
                        documentId: string;
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
    } & {
        id: string;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        guardianId: string;
        submittedByUserId: string | null;
        guestName: string | null;
        guestPhone: string | null;
        guestEmail: string | null;
        playerId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        invoiceId: string | null;
        staffNotes: string | null;
    }>;
}
