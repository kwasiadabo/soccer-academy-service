import { RequestUser } from '../auth/types';
import { FinanceService } from './finance.service';
import { AddFeeTypeItemDto, CreateFeeTypeDto, UpdateFeeTypeDto } from './dto/fee-type.dto';
import { CreateFeeItemDto, UpdateFeeItemDto } from './dto/fee-item.dto';
import { CreateInvoiceDto } from './dto/invoice.dto';
import { CreatePaymentDto } from './dto/payment.dto';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    findAllFeeItems(includeInactive?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }[]>;
    createFeeItem(dto: CreateFeeItemDto): import(".prisma/client").Prisma.Prisma__FeeItemClient<{
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateFeeItem(id: string, dto: UpdateFeeItemDto): Promise<{
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
    }>;
    findAllFeeTypes(includeInactive?: string): import(".prisma/client").Prisma.PrismaPromise<({
        items: ({
            feeItem: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
            };
        } & {
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        isRegistrationFee: boolean;
        isRecurring: boolean;
        defaultAmount: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    createFeeType(dto: CreateFeeTypeDto): Promise<{
        items: ({
            feeItem: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
            };
        } & {
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        isRegistrationFee: boolean;
        isRecurring: boolean;
        defaultAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateFeeType(id: string, dto: UpdateFeeTypeDto): Promise<{
        items: ({
            feeItem: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
            };
        } & {
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        isRegistrationFee: boolean;
        isRecurring: boolean;
        defaultAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    addFeeTypeItem(id: string, dto: AddFeeTypeItemDto): Promise<{
        items: ({
            feeItem: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
            };
        } & {
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        isRegistrationFee: boolean;
        isRecurring: boolean;
        defaultAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeFeeTypeItem(id: string, feeItemId: string): Promise<{
        items: ({
            feeItem: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isActive: boolean;
            };
        } & {
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            feeTypeId: string;
            feeItemId: string;
        })[];
    } & {
        id: string;
        academyId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        isRegistrationFee: boolean;
        isRecurring: boolean;
        defaultAmount: import("@prisma/client/runtime/library").Decimal;
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
    listDebtors(): Promise<import("./finance.service").DebtorRow[]>;
    getDebtorsAging(minMonths?: string): Promise<import("./finance.service").DebtorAgingRow[]>;
    getPaymentsReport(from?: string, to?: string, feeTypeId?: string, playerId?: string): Promise<import("./finance.service").PaymentReport>;
    getMonthlyBilling(month?: string): Promise<import("./finance.service").MonthlyBillingReport>;
    findInvoicesForPlayer(playerId: string): import(".prisma/client").Prisma.PrismaPromise<({
        feeType: {
            items: ({
                feeItem: {
                    id: string;
                    academyId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    isActive: boolean;
                };
            } & {
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                amount: import("@prisma/client/runtime/library").Decimal;
                feeTypeId: string;
                feeItemId: string;
            })[];
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            isRegistrationFee: boolean;
            isRecurring: boolean;
            defaultAmount: import("@prisma/client/runtime/library").Decimal;
        };
        allocations: {
            id: string;
            academyId: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentId: string;
            invoiceId: string;
        }[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        playerId: string;
        feeTypeId: string;
        gracePeriodDays: number;
        invoiceNumber: string;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        dueDate: Date;
        issuedAt: Date;
        waivedAt: Date | null;
        waivedReason: string | null;
    })[]>;
    createInvoice(dto: CreateInvoiceDto): Promise<{
        feeType: {
            items: ({
                feeItem: {
                    id: string;
                    academyId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    isActive: boolean;
                };
            } & {
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                amount: import("@prisma/client/runtime/library").Decimal;
                feeTypeId: string;
                feeItemId: string;
            })[];
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            isRegistrationFee: boolean;
            isRecurring: boolean;
            defaultAmount: import("@prisma/client/runtime/library").Decimal;
        };
        allocations: {
            id: string;
            academyId: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentId: string;
            invoiceId: string;
        }[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        playerId: string;
        feeTypeId: string;
        gracePeriodDays: number;
        invoiceNumber: string;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        dueDate: Date;
        issuedAt: Date;
        waivedAt: Date | null;
        waivedReason: string | null;
    }>;
    createPayment(dto: CreatePaymentDto, user: RequestUser): Promise<{
        allocations: {
            id: string;
            academyId: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentId: string;
            invoiceId: string;
        }[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        paidAt: Date;
        playerId: string;
        receiptNumber: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string | null;
        receivedByUserId: string;
        reversedByUserId: string | null;
        reversedAt: Date | null;
        reversalReason: string | null;
    }>;
    runRecurringInvoices(): Promise<{
        created: number;
        skipped: number;
    }>;
    sendReminder(id: string, playerId: string): Promise<{
        delivered: boolean;
        channels: {
            inApp: boolean;
            sms: boolean;
            email: boolean;
        };
    }>;
}
