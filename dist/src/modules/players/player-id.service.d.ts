import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
export declare class PlayerIdService {
    private readonly prisma;
    private readonly tenantContext;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    generate(ageCategoryCode: string, dateOfBirth: Date): Promise<string>;
    private getAcademyCode;
}
