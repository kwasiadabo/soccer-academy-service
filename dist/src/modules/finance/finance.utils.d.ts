import { Prisma } from '@prisma/client';
type Decimalish = Prisma.Decimal | number | string;
interface InvoiceBalanceInput {
    amount: Decimalish;
    discountAmount: Decimalish;
    allocations: {
        amount: Decimalish;
    }[];
}
export declare function computeRemainingBalance(invoice: InvoiceBalanceInput): number;
export declare function generateInvoiceNumber(): string;
export declare function generateReceiptNumber(): string;
export declare function monthsBetween(from: Date, to: Date): number;
export {};
