import { ConfigService } from '@nestjs/config';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class SmsService {
    private readonly config;
    private readonly prisma;
    private readonly tenantContext;
    private readonly logger;
    private readonly endpoint;
    constructor(config: ConfigService, prisma: PrismaService, tenantContext: TenantContextService);
    send(phone: string, message: string): Promise<boolean>;
}
