import { MerchandiseOrderStatus } from '@prisma/client';
import { MerchandiseOrdersService } from './merchandise-orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class MerchandiseOrdersController {
    private readonly ordersService;
    constructor(ordersService: MerchandiseOrdersService);
    listAll(status?: MerchandiseOrderStatus): import(".prisma/client").Prisma.PrismaPromise<({
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
    pendingCount(): import(".prisma/client").Prisma.PrismaPromise<number>;
    getReport(from?: string, to?: string, status?: string): Promise<import("./merchandise-orders.service").OrdersReport>;
    getOne(id: string): Promise<{
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
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
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
