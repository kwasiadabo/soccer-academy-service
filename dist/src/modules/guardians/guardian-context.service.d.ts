import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
export declare class GuardianContextService {
    private readonly prisma;
    private readonly tenantContext;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    resolveGuardianId(userId: string): Promise<string>;
    resolvePlayerIds(guardianId: string): Promise<string[]>;
    assertOwnsPlayer(guardianId: string, playerId: string): Promise<void>;
}
