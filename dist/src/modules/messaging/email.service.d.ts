import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PlatformEmailService } from '../billing/platform-email.service';
export declare class EmailService {
    private readonly platformEmail;
    private readonly tenantContext;
    constructor(platformEmail: PlatformEmailService, tenantContext: TenantContextService);
    send(params: {
        to: string;
        subject: string;
        html: string;
    }): Promise<boolean>;
}
