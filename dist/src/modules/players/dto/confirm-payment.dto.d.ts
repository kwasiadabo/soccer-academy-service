import { PaymentMethod } from '@prisma/client';
export declare class ConfirmRegistrationPaymentDto {
    method: PaymentMethod;
    reference?: string;
}
