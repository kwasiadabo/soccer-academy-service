import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../prisma/prisma.service';
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
    private readonly prisma;
    private readonly tenantContext;
    private readonly logger;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    private getCredentials;
    chargeMobileMoney(params: {
        email: string;
        amount: number;
        phone: string;
        provider: MomoProvider;
        reference: string;
    }): Promise<PaystackChargeResult>;
    verifyTransaction(reference: string): Promise<PaystackVerification>;
}
