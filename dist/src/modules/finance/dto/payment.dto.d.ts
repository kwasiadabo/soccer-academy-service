import { PaymentMethod } from '@prisma/client';
export declare class PaymentAllocationInputDto {
    invoiceId: string;
    amount: number;
}
export declare class CreatePaymentDto {
    playerId: string;
    method: PaymentMethod;
    reference?: string;
    allocations: PaymentAllocationInputDto[];
}
