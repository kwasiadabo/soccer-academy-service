import { PrismaService } from '../prisma/prisma.service';
export declare class GuardianContextService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveGuardianId(userId: string): Promise<string>;
    resolvePlayerIds(guardianId: string): Promise<string[]>;
    assertOwnsPlayer(guardianId: string, playerId: string): Promise<void>;
}
