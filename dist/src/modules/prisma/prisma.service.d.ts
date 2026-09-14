import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly tenantContext;
    constructor(tenantContext: TenantContextService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private applyTenantScoping;
}
