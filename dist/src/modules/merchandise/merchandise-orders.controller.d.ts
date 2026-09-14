import { MerchandiseOrderStatus } from '@prisma/client';
import { MerchandiseOrdersService } from './merchandise-orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class MerchandiseOrdersController {
    private readonly ordersService;
    constructor(ordersService: MerchandiseOrdersService);
    listAll(status?: MerchandiseOrderStatus): import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    pendingCount(): import(".prisma/client").Prisma.PrismaPromise<number>;
    getReport(from?: string, to?: string, status?: string): Promise<import("./merchandise-orders.service").OrdersReport>;
    getOne(id: string): Promise<{
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
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
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
