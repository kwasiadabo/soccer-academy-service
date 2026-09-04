import { MerchandiseOrderStatus } from '@prisma/client';
import { MerchandiseOrdersService } from './merchandise-orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class MerchandiseOrdersController {
    private readonly ordersService;
    constructor(ordersService: MerchandiseOrdersService);
    listAll(status?: MerchandiseOrderStatus): import(".prisma/client").Prisma.PrismaPromise<({
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        playerId: string;
        guardianId: string;
        invoiceId: string | null;
        submittedByUserId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        staffNotes: string | null;
    })[]>;
    pendingCount(): import(".prisma/client").Prisma.PrismaPromise<number>;
    getOne(id: string): Promise<{
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        playerId: string;
        guardianId: string;
        invoiceId: string | null;
        submittedByUserId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        staffNotes: string | null;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.MerchandiseOrderStatus;
        playerId: string;
        guardianId: string;
        invoiceId: string | null;
        submittedByUserId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        staffNotes: string | null;
    }>;
}
