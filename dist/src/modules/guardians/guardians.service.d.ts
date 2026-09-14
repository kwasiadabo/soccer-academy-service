import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { GrantGuardianPortalAccessDto } from './dto/grant-portal-access.dto';
export declare class GuardiansService {
    private readonly prisma;
    private readonly authService;
    constructor(prisma: PrismaService, authService: AuthService);
    findAll(search?: string): Promise<({
        players: ({
            player: {
                id: string;
                status: import(".prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                academyId: string;
                deletedAt: Date | null;
                ageCategoryId: string | null;
                middleName: string | null;
                playerCode: string | null;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                nationality: string | null;
                photoDocumentId: string | null;
                residentialAddress: string | null;
                medicalNotes: string | null;
                previousExperience: string | null;
                preferredPosition: string | null;
                dominantFoot: import(".prisma/client").$Enums.DominantFoot | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                teamId: string | null;
                trainingGroupId: string | null;
                primaryCoachId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            playerId: string;
            guardianId: string;
            relationship: import(".prisma/client").$Enums.GuardianRelationship;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        firstName: string;
        lastName: string;
        academyId: string;
        phone: string;
        deletedAt: Date | null;
        userId: string | null;
        address: string | null;
    })[]>;
    findOne(id: string): Promise<{
        players: ({
            player: {
                id: string;
                status: import(".prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                academyId: string;
                deletedAt: Date | null;
                ageCategoryId: string | null;
                middleName: string | null;
                playerCode: string | null;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                nationality: string | null;
                photoDocumentId: string | null;
                residentialAddress: string | null;
                medicalNotes: string | null;
                previousExperience: string | null;
                preferredPosition: string | null;
                dominantFoot: import(".prisma/client").$Enums.DominantFoot | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                teamId: string | null;
                trainingGroupId: string | null;
                primaryCoachId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            playerId: string;
            guardianId: string;
            relationship: import(".prisma/client").$Enums.GuardianRelationship;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        firstName: string;
        lastName: string;
        academyId: string;
        phone: string;
        deletedAt: Date | null;
        userId: string | null;
        address: string | null;
    }>;
    grantPortalAccess(id: string, dto: GrantGuardianPortalAccessDto): Promise<{
        players: ({
            player: {
                id: string;
                status: import(".prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                academyId: string;
                deletedAt: Date | null;
                ageCategoryId: string | null;
                middleName: string | null;
                playerCode: string | null;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                nationality: string | null;
                photoDocumentId: string | null;
                residentialAddress: string | null;
                medicalNotes: string | null;
                previousExperience: string | null;
                preferredPosition: string | null;
                dominantFoot: import(".prisma/client").$Enums.DominantFoot | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                teamId: string | null;
                trainingGroupId: string | null;
                primaryCoachId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            playerId: string;
            guardianId: string;
            relationship: import(".prisma/client").$Enums.GuardianRelationship;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        firstName: string;
        lastName: string;
        academyId: string;
        phone: string;
        deletedAt: Date | null;
        userId: string | null;
        address: string | null;
    }>;
}
