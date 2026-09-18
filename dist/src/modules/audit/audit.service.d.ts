import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
export interface AuditEntry {
    actorUserId?: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    beforeData?: unknown;
    afterData?: unknown;
    ipAddress?: string | null;
}
export declare class AuditService {
    private readonly prisma;
    private readonly tenantContext;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    record(entry: AuditEntry): Promise<void>;
}
