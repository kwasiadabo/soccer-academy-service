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
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        branchId: string | null;
        startDate: Date;
        endDate: Date;
    }[]>;
    createSeason(dto: CreateSeasonDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        branchId: string | null;
        startDate: Date;
        endDate: Date;
    }>;
    updateSeason(id: string, dto: UpdateSeasonDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        branchId: string | null;
        startDate: Date;
        endDate: Date;
    }>;
    listAgeCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        sortOrder: number;
        isActive: boolean;
        branchId: string | null;
        code: string;
        minAge: number;
        maxAge: number;
    }[]>;
    createAgeCategory(dto: CreateAgeCategoryDto): import(".prisma/client").Prisma.Prisma__AgeCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        sortOrder: number;
        isActive: boolean;
        branchId: string | null;
        code: string;
        minAge: number;
        maxAge: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateAgeCategory(id: string, dto: UpdateAgeCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        sortOrder: number;
        isActive: boolean;
        branchId: string | null;
        code: string;
        minAge: number;
        maxAge: number;
    }>;
    listTeams(): import(".prisma/client").Prisma.PrismaPromise<({
        coachAssignments: ({
            coach: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                firstName: string;
                lastName: string;
                phone: string | null;
                deletedAt: Date | null;
                academyId: string;
                isActive: boolean;
                userId: string | null;
                middleName: string | null;
                role: import(".prisma/client").$Enums.StaffRole;
                bio: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            teamId: string | null;
            trainingGroupId: string | null;
            role: import(".prisma/client").$Enums.CoachAssignmentRole;
            coachId: string;
            effectiveFrom: Date;
            effectiveTo: Date | null;
        })[];
        ageCategory: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            sortOrder: number;
            isActive: boolean;
            branchId: string | null;
            code: string;
            minAge: number;
            maxAge: number;
        };
        season: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            branchId: string | null;
            startDate: Date;
            endDate: Date;
        };
        headCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            academyId: string;
            isActive: boolean;
            userId: string | null;
            middleName: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            bio: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        ageCategoryId: string;
        branchId: string | null;
        seasonId: string;
        headCoachId: string | null;
    })[]>;
    createTeam(dto: CreateTeamDto): import(".prisma/client").Prisma.Prisma__TeamClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        ageCategoryId: string;
        branchId: string | null;
        seasonId: string;
        headCoachId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTeam(id: string, dto: UpdateTeamDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        ageCategoryId: string;
        branchId: string | null;
        seasonId: string;
        headCoachId: string | null;
    }>;
    listTrainingGroups(): import(".prisma/client").Prisma.PrismaPromise<({
        team: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            academyId: string;
            isActive: boolean;
            ageCategoryId: string;
            branchId: string | null;
            seasonId: string;
            headCoachId: string | null;
        };
        primaryCoach: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            deletedAt: Date | null;
            academyId: string;
            isActive: boolean;
            userId: string | null;
            middleName: string | null;
            role: import(".prisma/client").$Enums.StaffRole;
            bio: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        teamId: string;
        primaryCoachId: string | null;
        branchId: string | null;
    })[]>;
    createTrainingGroup(dto: CreateTrainingGroupDto): import(".prisma/client").Prisma.Prisma__TrainingGroupClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        teamId: string;
        primaryCoachId: string | null;
        branchId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTrainingGroup(id: string, dto: UpdateTrainingGroupDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        academyId: string;
        isActive: boolean;
        teamId: string;
        primaryCoachId: string | null;
        branchId: string | null;
    }>;
}
