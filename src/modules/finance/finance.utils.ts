import { Prisma } from '@prisma/client';

type Decimalish = Prisma.Decimal | number | string;

interface InvoiceBalanceInput {
  amount: Decimalish;
  discountAmount: Decimalish;
  allocations: { amount: Decimalish }[];
}

/**
 * Remaining balance = amount - discount - sum(payment allocations).
 * Single source of truth — also used by parent-portal's finance summary so
 * both surfaces never disagree about what a player still owes.
 */
export function computeRemainingBalance(invoice: InvoiceBalanceInput): number {
  const allocated = invoice.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
  return Number(invoice.amount) - Number(invoice.discountAmount) - allocated;
}

const SHORT_CODE_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Short enough to read/type off a printed receipt or invoice; 36^7 (~78 billion)
// combinations keeps collisions negligible at this app's scale — both Invoice.invoiceNumber
// and Payment.receiptNumber are @unique, so a clash surfaces as a create error rather than
// silently overwriting.
function generateShortCode(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += SHORT_CODE_ALPHABET[Math.floor(Math.random() * SHORT_CODE_ALPHABET.length)];
  }
  return result;
}

const INVOICE_NUMBER_LENGTH = 7;
const RECEIPT_NUMBER_LENGTH = 7;

export function generateInvoiceNumber(): string {
  return generateShortCode(INVOICE_NUMBER_LENGTH);
}

export function generateReceiptNumber(): string {
  return generateShortCode(RECEIPT_NUMBER_LENGTH);
}

/**
 * Whole calendar months elapsed from `from` to `to` (never negative).
 * Used to express how long a player has been in arrears in months rather
 * than raw days, since fees are billed monthly.
 */
export function monthsBetween(from: Date, to: Date): number {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) {
    months -= 1;
  }
  return Math.max(0, months);
}
