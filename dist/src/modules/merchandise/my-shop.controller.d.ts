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
    getProduct(id: string): Promise<{
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
    getProductImage(id: string, imageId: string, res: Response): Promise<void>;
    listMyOrders(user: RequestUser): Promise<({
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
                        academyId: string;
                        createdAt: Date;
                        sortOrder: number;
                        documentId: string;
                        productId: string;
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
                };
            } & {
                id: string;
                academyId: string;
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
            academyId: string;
            createdAt: Date;
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
        academyId: string;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        createdAt: Date;
        updatedAt: Date;
        playerId: string;
        guardianId: string;
        invoiceId: string | null;
        submittedByUserId: string | null;
        guestName: string | null;
        guestPhone: string | null;
        guestEmail: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        staffNotes: string | null;
    })[]>;
    getMyOrder(id: string, user: RequestUser): Promise<{
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
                        academyId: string;
                        createdAt: Date;
                        sortOrder: number;
                        documentId: string;
                        productId: string;
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
                };
            } & {
                id: string;
                academyId: string;
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
            academyId: string;
            createdAt: Date;
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
        academyId: string;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        createdAt: Date;
        updatedAt: Date;
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
    createOrder(dto: CreateOrderDto, user: RequestUser): Promise<{
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
                        academyId: string;
                        createdAt: Date;
                        sortOrder: number;
                        documentId: string;
                        productId: string;
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
                };
            } & {
                id: string;
                academyId: string;
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
            academyId: string;
            createdAt: Date;
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
        academyId: string;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        createdAt: Date;
        updatedAt: Date;
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
