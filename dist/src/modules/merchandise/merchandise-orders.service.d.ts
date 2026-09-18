import { MerchandiseOrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';
export type OrdersReportStatus = 'SOLD' | 'PENDING';
export interface OrdersReportRow {
    orderId: string;
    invoiceNumber: string | null;
    date: Date;
    status: OrdersReportStatus;
    player: {
        id: string;
        firstName: string;
        lastName: string;
        playerCode: string | null;
    };
    productName: string;
    category: string;
    sizeLabel: string;
    quantity: number;
    unitPriceAtOrder: number;
    lineTotal: number;
}
export interface OrdersReport {
    rows: OrdersReportRow[];
    summary: {
        totalAmount: number;
        itemCount: number;
        orderCount: number;
        byProduct: {
            productName: string;
            quantity: number;
            total: number;
        }[];
    };
}
export declare class MerchandiseOrdersService {
    private readonly prisma;
    private readonly guardianContext;
    private readonly tenantContext;
    constructor(prisma: PrismaService, guardianContext: GuardianContextService, tenantContext: TenantContextService);
    createOrder(userId: string, dto: CreateOrderDto): Promise<{
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
            amount: Prisma.Decimal;
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
            dueDate: Date;
            allocations: {
                amount: Prisma.Decimal;
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    }>;
    lookupPlayerByCode(playerCode: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        team: {
            name: string;
        } | null;
    }>;
    createGuestOrder(dto: CreateGuestOrderDto): Promise<{
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
            amount: Prisma.Decimal;
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
            dueDate: Date;
            allocations: {
                amount: Prisma.Decimal;
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    }>;
    private reserveItems;
    listMine(userId: string): Promise<({
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
            amount: Prisma.Decimal;
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
            dueDate: Date;
            allocations: {
                amount: Prisma.Decimal;
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    })[]>;
    getMine(userId: string, orderId: string): Promise<{
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
            amount: Prisma.Decimal;
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
            dueDate: Date;
            allocations: {
                amount: Prisma.Decimal;
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    }>;
    listAll(status?: MerchandiseOrderStatus): Prisma.PrismaPromise<({
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
            amount: Prisma.Decimal;
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
            dueDate: Date;
            allocations: {
                amount: Prisma.Decimal;
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    })[]>;
    getForStaff(orderId: string): Promise<{
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
            amount: Prisma.Decimal;
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
            dueDate: Date;
            allocations: {
                amount: Prisma.Decimal;
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    }>;
    pendingCount(): Prisma.PrismaPromise<number>;
    getOrdersReport(from?: string, to?: string, status?: OrdersReportStatus): Promise<OrdersReport>;
    private buildDateFilter;
    private getSoldOrderRows;
    private getPendingOrderRows;
    updateStatus(orderId: string, status: MerchandiseOrderStatus, staffNotes?: string): Promise<{
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
            amount: Prisma.Decimal;
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
            dueDate: Date;
            allocations: {
                amount: Prisma.Decimal;
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                academyId: string;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    }>;
    private assertTransitionAllowed;
    private restoreStock;
}
