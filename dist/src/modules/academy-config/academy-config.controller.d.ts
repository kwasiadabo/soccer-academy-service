import { AcademyConfigService } from './academy-config.service';
import { CreateSeasonDto, UpdateSeasonDto } from './dto/season.dto';
import { CreateAgeCategoryDto, UpdateAgeCategoryDto } from './dto/age-category.dto';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { CreateTrainingGroupDto, UpdateTrainingGroupDto } from './dto/training-group.dto';
export declare class AcademyConfigController {
    private readonly service;
    constructor(service: AcademyConfigService);
    listSeasons(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }[]>;
    createSeason(dto: CreateSeasonDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }>;
    updateSeason(id: string, dto: UpdateSeasonDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }>;
    listAgeCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        isActive: boolean;
        code: string;
        minAge: number;
        maxAge: number;
        sortOrder: number;
    }[]>;
    createAgeCategory(dto: CreateAgeCategoryDto): import(".prisma/client").Prisma.Prisma__AgeCategoryClient<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        isActive: boolean;
        code: string;
        minAge: number;
        maxAge: number;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateAgeCategory(id: string, dto: UpdateAgeCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        isActive: boolean;
        code: string;
        minAge: number;
        maxAge: number;
        sortOrder: number;
    }>;
    listTeams(): import(".prisma/client").Prisma.PrismaPromise<({
        season: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
        };
        ageCategory: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            code: string;
            minAge: number;
            maxAge: number;
            sortOrder: number;
        };
        headCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
        coachAssignments: ({
            coach: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.StaffRole;
                email: string | null;
                firstName: string;
                lastName: string;
                phone: string | null;
                deletedAt: Date | null;
                userId: string | null;
                isActive: boolean;
                middleName: string | null;
                bio: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.CoachAssignmentRole;
            teamId: string | null;
            effectiveTo: Date | null;
            effectiveFrom: Date;
            coachId: string;
            trainingGroupId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        isActive: boolean;
        ageCategoryId: string;
        seasonId: string;
        headCoachId: string | null;
    })[]>;
    createTeam(dto: CreateTeamDto): import(".prisma/client").Prisma.Prisma__TeamClient<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        isActive: boolean;
        ageCategoryId: string;
        seasonId: string;
        headCoachId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTeam(id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        isActive: boolean;
        ageCategoryId: string;
        seasonId: string;
        headCoachId: string | null;
    }>;
    listTrainingGroups(): import(".prisma/client").Prisma.PrismaPromise<({
        team: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            branchId: string | null;
            isActive: boolean;
            ageCategoryId: string;
            seasonId: string;
            headCoachId: string | null;
        };
        primaryCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.StaffRole;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            userId: string | null;
            isActive: boolean;
            middleName: string | null;
            bio: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        isActive: boolean;
        teamId: string;
        primaryCoachId: string | null;
    })[]>;
    createTrainingGroup(dto: CreateTrainingGroupDto): import(".prisma/client").Prisma.Prisma__TrainingGroupClient<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        isActive: boolean;
        teamId: string;
        primaryCoachId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTrainingGroup(id: string, dto: UpdateTrainingGroupDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        branchId: string | null;
        isActive: boolean;
        teamId: string;
        primaryCoachId: string | null;
    }>;
}
