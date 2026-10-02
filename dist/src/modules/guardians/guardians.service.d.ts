import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { GrantGuardianPortalAccessDto } from './dto/grant-portal-access.dto';
export declare class GuardiansService {
    private readonly prisma;
    private readonly authService;
    private readonly tenantContext;
    constructor(prisma: PrismaService, authService: AuthService, tenantContext: TenantContextService);
    findAll(search?: string): Promise<({
        players: ({
            player: {
                id: string;
                academyId: string;
                firstName: string;
                lastName: string;
                status: import(".prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                playerCode: string | null;
                middleName: string | null;
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
                ageCategoryId: string | null;
                teamId: string | null;
                trainingGroupId: string | null;
                primaryCoachId: string | null;
            };
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            playerId: string;
            guardianId: string;
            relationship: import(".prisma/client").$Enums.GuardianRelationship;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        address: string | null;
    })[]>;
    findOne(id: string): Promise<{
        players: ({
            player: {
                id: string;
                academyId: string;
                firstName: string;
                lastName: string;
                status: import(".prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                playerCode: string | null;
                middleName: string | null;
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
                ageCategoryId: string | null;
                teamId: string | null;
                trainingGroupId: string | null;
                primaryCoachId: string | null;
            };
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            playerId: string;
            guardianId: string;
            relationship: import(".prisma/client").$Enums.GuardianRelationship;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        address: string | null;
    }>;
    grantPortalAccess(id: string, dto: GrantGuardianPortalAccessDto): Promise<{
        players: ({
            player: {
                id: string;
                academyId: string;
                firstName: string;
                lastName: string;
                status: import(".prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                playerCode: string | null;
                middleName: string | null;
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
                ageCategoryId: string | null;
                teamId: string | null;
                trainingGroupId: string | null;
                primaryCoachId: string | null;
            };
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            playerId: string;
            guardianId: string;
            relationship: import(".prisma/client").$Enums.GuardianRelationship;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        address: string | null;
    }>;
}
