import { MerchandiseOrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class MerchandiseOrdersService {
    private readonly prisma;
    private readonly guardianContext;
    constructor(prisma: PrismaService, guardianContext: GuardianContextService);
    createOrder(userId: string, dto: CreateOrderDto): Promise<{
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
            amount: Prisma.Decimal;
            allocations: {
                amount: Prisma.Decimal;
            }[];
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    }>;
    listMine(userId: string): Promise<({
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
            amount: Prisma.Decimal;
            allocations: {
                amount: Prisma.Decimal;
            }[];
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    })[]>;
    getMine(userId: string, orderId: string): Promise<{
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
            amount: Prisma.Decimal;
            allocations: {
                amount: Prisma.Decimal;
            }[];
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    }>;
    listAll(status?: MerchandiseOrderStatus): Prisma.PrismaPromise<({
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
            amount: Prisma.Decimal;
            allocations: {
                amount: Prisma.Decimal;
            }[];
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    })[]>;
    getForStaff(orderId: string): Promise<{
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
            amount: Prisma.Decimal;
            allocations: {
                amount: Prisma.Decimal;
            }[];
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    }>;
    pendingCount(): Prisma.PrismaPromise<number>;
    updateStatus(orderId: string, status: MerchandiseOrderStatus, staffNotes?: string): Promise<{
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
                    basePrice: Prisma.Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                productId: string;
                sizeLabel: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            orderId: string;
            productVariantId: string;
            quantity: number;
            unitPriceAtOrder: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
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
            amount: Prisma.Decimal;
            allocations: {
                amount: Prisma.Decimal;
            }[];
            invoiceNumber: string;
            discountAmount: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        staffNotes: string | null;
    }>;
    private assertTransitionAllowed;
    private restoreStock;
}
