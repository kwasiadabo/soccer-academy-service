export declare class CreateInvoiceDto {
    playerId: string;
    feeTypeId: string;
    description?: string;
    amount: number;
    dueDate: string;
    gracePeriodDays?: number;
}
