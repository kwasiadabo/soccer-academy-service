import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../messaging/email.service';
import { SmsService } from '../messaging/sms.service';
export declare class ReceiptsService {
    private readonly prisma;
    private readonly tenantContext;
    private readonly email;
    private readonly sms;
    private readonly logger;
    constructor(prisma: PrismaService, tenantContext: TenantContextService, email: EmailService, sms: SmsService);
    private getBranding;
    private renderLogo;
    sendPaymentReceipt(paymentId: string): Promise<void>;
    sendPaymentReminder(invoiceId: string): Promise<{
        sms: boolean;
        email: boolean;
    }>;
}
