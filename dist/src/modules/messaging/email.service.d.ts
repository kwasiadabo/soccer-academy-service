import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class EmailService {
    private readonly prisma;
    private readonly tenantContext;
    private readonly logger;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    send(params: {
        to: string;
        subject: string;
        html: string;
    }): Promise<boolean>;
}
