import { PrismaService } from '../prisma/prisma.service';
export declare class PlayerIdService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generate(ageCategoryCode: string, dateOfBirth: Date): Promise<string>;
    private getAcademyCode;
}
