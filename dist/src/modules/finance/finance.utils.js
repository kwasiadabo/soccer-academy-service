"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeRemainingBalance = computeRemainingBalance;
exports.generateInvoiceNumber = generateInvoiceNumber;
exports.generateReceiptNumber = generateReceiptNumber;
exports.monthsBetween = monthsBetween;
function computeRemainingBalance(invoice) {
    const allocated = invoice.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
    return Number(invoice.amount) - Number(invoice.discountAmount) - allocated;
}
const SHORT_CODE_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function generateShortCode(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += SHORT_CODE_ALPHABET[Math.floor(Math.random() * SHORT_CODE_ALPHABET.length)];
    }
    return result;
}
const INVOICE_NUMBER_LENGTH = 7;
const RECEIPT_NUMBER_LENGTH = 7;
function generateInvoiceNumber() {
    return generateShortCode(INVOICE_NUMBER_LENGTH);
}
function generateReceiptNumber() {
    return generateShortCode(RECEIPT_NUMBER_LENGTH);
}
function monthsBetween(from, to) {
    let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    if (to.getDate() < from.getDate()) {
        months -= 1;
    }
    return Math.max(0, months);
}
//# sourceMappingURL=finance.utils.js.map