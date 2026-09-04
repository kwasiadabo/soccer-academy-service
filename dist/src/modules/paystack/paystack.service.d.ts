import { ConfigService } from '@nestjs/config';
export type MomoProvider = 'mtn' | 'vod' | 'tgo';
export interface PaystackChargeResult {
    reference: string;
    status: string;
    displayText: string | null;
}
export interface PaystackVerification {
    status: string;
    amount: number;
}
export declare class PaystackService {
    private readonly config;
    private readonly logger;
    private readonly secretKey?;
    private readonly currency;
    constructor(config: ConfigService);
    private assertConfigured;
    chargeMobileMoney(params: {
        email: string;
        amount: number;
        phone: string;
        provider: MomoProvider;
        reference: string;
    }): Promise<PaystackChargeResult>;
    verifyTransaction(reference: string): Promise<PaystackVerification>;
}
