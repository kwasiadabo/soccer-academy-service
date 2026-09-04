import { GuardiansService } from './guardians.service';
import { GrantGuardianPortalAccessDto } from './dto/grant-portal-access.dto';
export declare class GuardiansController {
    private readonly guardiansService;
    constructor(guardiansService: GuardiansService);
    findAll(search?: string): Promise<({
        players: ({
            player: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                status: import(".prisma/client").$Enums.PlayerStatus;
                deletedAt: Date | null;
                ageCategoryId: string | null;
                teamId: string | null;
                primaryCoachId: string | null;
                middleName: string | null;
                trainingGroupId: string | null;
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
            };
        } & {
            id: string;
            createdAt: Date;
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
        phone: string;
        deletedAt: Date | null;
        userId: string | null;
        address: string | null;
    })[]>;
    findOne(id: string): Promise<{
        players: ({
            player: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                status: import(".prisma/client").$Enums.PlayerStatus;
                deletedAt: Date | null;
                ageCategoryId: string | null;
                teamId: string | null;
                primaryCoachId: string | null;
                middleName: string | null;
                trainingGroupId: string | null;
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
            };
        } & {
            id: string;
            createdAt: Date;
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
        phone: string;
        deletedAt: Date | null;
        userId: string | null;
        address: string | null;
    }>;
    grantPortalAccess(id: string, dto: GrantGuardianPortalAccessDto): Promise<{
        players: ({
            player: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                status: import(".prisma/client").$Enums.PlayerStatus;
                deletedAt: Date | null;
                ageCategoryId: string | null;
                teamId: string | null;
                primaryCoachId: string | null;
                middleName: string | null;
                trainingGroupId: string | null;
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
            };
        } & {
            id: string;
            createdAt: Date;
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
        phone: string;
        deletedAt: Date | null;
        userId: string | null;
        address: string | null;
    }>;
}
