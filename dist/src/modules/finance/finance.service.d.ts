import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlayersService } from '../players/players.service';
import { ReceiptsService } from '../receipts/receipts.service';
import { CreateFeeTypeDto, UpdateFeeTypeDto } from './dto/fee-type.dto';
import { CreateFeeItemDto, UpdateFeeItemDto } from './dto/fee-item.dto';
import { CreateInvoiceDto } from './dto/invoice.dto';
import { CreatePaymentDto } from './dto/payment.dto';
export interface DebtorRow {
    player: {
        id: string;
        firstName: string;
        lastName: string;
        playerCode: string | null;
        status: string;
    };
    invoices: {
        id: string;
        invoiceNumber: string;
        feeTypeName: string;
        dueDate: Date;
        remaining: number;
        isOverdue: boolean;
    }[];
    totalOwed: number;
    hasOverdue: boolean;
}
export interface DebtorAgingRow extends DebtorRow {
    oldestDueDate: Date;
    monthsOwing: number;
}
export interface PaymentReportRow {
    paymentId: string;
    receiptNumber: string;
    paidAt: Date;
    method: string;
    reference: string | null;
    player: {
        id: string;
        firstName: string;
        lastName: string;
    };
    invoiceId: string;
    invoiceNumber: string;
    feeTypeId: string;
    feeTypeName: string;
    feeTypeCategory: string;
    amount: number;
}
export interface PaymentReport {
    rows: PaymentReportRow[];
    summary: {
        totalAmount: number;
        count: number;
        byFeeType: {
            feeTypeId: string;
            feeTypeName: string;
            total: number;
        }[];
        byMethod: {
            method: string;
            total: number;
        }[];
    };
}
export interface MonthlyBillingRow {
    id: string;
    invoiceNumber: string;
    player: {
        id: string;
        firstName: string;
        lastName: string;
        playerCode: string | null;
        status: string;
    };
    feeTypeId: string;
    feeTypeName: string;
    amount: number;
    remaining: number;
    dueDate: Date;
    issuedAt: Date;
    status: string;
}
export interface MonthlyBillingReport {
    month: string;
    rows: MonthlyBillingRow[];
    summary: {
        totalBilled: number;
        totalCollected: number;
        totalOutstanding: number;
        count: number;
    };
}
export declare class FinanceService {
    private readonly prisma;
    private readonly playersService;
    private readonly receipts;
    private readonly logger;
    constructor(prisma: PrismaService, playersService: PlayersService, receipts: ReceiptsService);
    findAllFeeItems(includeInactive?: boolean): Prisma.PrismaPromise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        defaultAmount: Prisma.Decimal;
    }[]>;
    createFeeItem(dto: CreateFeeItemDto): Prisma.Prisma__FeeItemClient<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        defaultAmount: Prisma.Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateFeeItem(id: string, dto: UpdateFeeItemDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        defaultAmount: Prisma.Decimal;
    }>;
    findAllFeeTypes(includeInactive?: boolean): Prisma.PrismaPromise<({
        items: ({
            feeItem: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                isActive: boolean;
                defaultAmount: Prisma.Decimal;
            };
        } & {
            createdAt: Date;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        category: import(".prisma/client").$Enums.FeeCategory;
        isRecurring: boolean;
        defaultAmount: Prisma.Decimal;
    })[]>;
    private deactivateOtherRegistrationFeeTypes;
    private recomputeFeeTypeAmount;
    createFeeType(dto: CreateFeeTypeDto): Promise<{
        items: ({
            feeItem: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                isActive: boolean;
                defaultAmount: Prisma.Decimal;
            };
        } & {
            createdAt: Date;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        category: import(".prisma/client").$Enums.FeeCategory;
        isRecurring: boolean;
        defaultAmount: Prisma.Decimal;
    }>;
    updateFeeType(id: string, dto: UpdateFeeTypeDto): Promise<{
        items: ({
            feeItem: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                isActive: boolean;
                defaultAmount: Prisma.Decimal;
            };
        } & {
            createdAt: Date;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        category: import(".prisma/client").$Enums.FeeCategory;
        isRecurring: boolean;
        defaultAmount: Prisma.Decimal;
    }>;
    addFeeTypeItem(feeTypeId: string, feeItemId: string): Promise<{
        items: ({
            feeItem: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                isActive: boolean;
                defaultAmount: Prisma.Decimal;
            };
        } & {
            createdAt: Date;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        category: import(".prisma/client").$Enums.FeeCategory;
        isRecurring: boolean;
        defaultAmount: Prisma.Decimal;
    }>;
    removeFeeTypeItem(feeTypeId: string, feeItemId: string): Promise<{
        items: ({
            feeItem: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                isActive: boolean;
                defaultAmount: Prisma.Decimal;
            };
        } & {
            createdAt: Date;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        category: import(".prisma/client").$Enums.FeeCategory;
        isRecurring: boolean;
        defaultAmount: Prisma.Decimal;
    }>;
    findInvoicesForPlayer(playerId: string): Prisma.PrismaPromise<({
        feeType: {
            items: ({
                feeItem: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    isActive: boolean;
                    defaultAmount: Prisma.Decimal;
                };
            } & {
                createdAt: Date;
                feeTypeId: string;
                feeItemId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            isActive: boolean;
            category: import(".prisma/client").$Enums.FeeCategory;
            isRecurring: boolean;
            defaultAmount: Prisma.Decimal;
        };
        allocations: {
            id: string;
            createdAt: Date;
            amount: Prisma.Decimal;
            paymentId: string;
            invoiceId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        deletedAt: Date | null;
        amount: Prisma.Decimal;
        playerId: string;
        invoiceNumber: string;
        feeTypeId: string;
        discountAmount: Prisma.Decimal;
        dueDate: Date;
        gracePeriodDays: number;
        issuedAt: Date;
        waivedAt: Date | null;
        waivedReason: string | null;
    })[]>;
    createInvoice(dto: CreateInvoiceDto): Promise<{
        feeType: {
            items: ({
                feeItem: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    isActive: boolean;
                    defaultAmount: Prisma.Decimal;
                };
            } & {
                createdAt: Date;
                feeTypeId: string;
                feeItemId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            isActive: boolean;
            category: import(".prisma/client").$Enums.FeeCategory;
            isRecurring: boolean;
            defaultAmount: Prisma.Decimal;
        };
        allocations: {
            id: string;
            createdAt: Date;
            amount: Prisma.Decimal;
            paymentId: string;
            invoiceId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        deletedAt: Date | null;
        amount: Prisma.Decimal;
        playerId: string;
        invoiceNumber: string;
        feeTypeId: string;
        discountAmount: Prisma.Decimal;
        dueDate: Date;
        gracePeriodDays: number;
        issuedAt: Date;
        waivedAt: Date | null;
        waivedReason: string | null;
    }>;
    createPayment(dto: CreatePaymentDto, receivedByUserId: string): Promise<{
        allocations: {
            id: string;
            createdAt: Date;
            amount: Prisma.Decimal;
            paymentId: string;
            invoiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        amount: Prisma.Decimal;
        receiptNumber: string;
        playerId: string;
        receivedByUserId: string;
        reversedByUserId: string | null;
        reversedAt: Date | null;
        reversalReason: string | null;
        paidAt: Date;
    }>;
    getTeamStats(): Promise<{
        teams: {
            paidUpToDate: number;
            teamId: string | null;
            teamName: string;
            activePlayers: number;
            owingMonthlySubscription: number;
        }[];
        totals: {
            activePlayers: number;
            owingMonthlySubscription: number;
            paidUpToDate: number;
        };
    }>;
    listDebtors(): Promise<DebtorRow[]>;
    getDebtorsAging(minMonths?: number): Promise<DebtorAgingRow[]>;
    getPaymentsReport(from?: string, to?: string, feeTypeId?: string, playerId?: string): Promise<PaymentReport>;
    handleMonthlyBillingCron(): Promise<void>;
    generateRecurringInvoices(): Promise<{
        created: number;
        skipped: number;
    }>;
    getMonthlyBilling(month?: string): Promise<MonthlyBillingReport>;
    sendPaymentReminder(playerId: string, invoiceId: string): Promise<{
        delivered: boolean;
        channels: {
            inApp: boolean;
            sms: boolean;
            email: boolean;
        };
    }>;
}
