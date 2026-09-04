import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
export declare class PlayerOfTheWeekService {
    private readonly prisma;
    private readonly storage;
    private readonly logger;
    constructor(prisma: PrismaService, storage: StorageService);
    handleWeeklyComputationCron(): Promise<void>;
    computeForAllTeams(): Promise<{
        picked: number;
        skipped: number;
    }>;
    findPublicFeed(): Promise<{
        id: string;
        firstName: string;
        lastInitial: string;
        teamName: string;
        weekOf: Date;
        averageRating: number;
        photoUrl: string;
    }[]>;
    getPublicPhoto(awardId: string): Promise<{
        buffer: Buffer;
        mimeType: string;
    }>;
}
