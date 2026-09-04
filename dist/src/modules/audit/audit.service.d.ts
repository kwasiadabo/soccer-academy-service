import { PrismaService } from '../prisma/prisma.service';
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
    constructor(prisma: PrismaService);
    record(entry: AuditEntry): Promise<void>;
}
