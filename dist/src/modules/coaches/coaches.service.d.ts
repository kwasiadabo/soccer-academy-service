import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateCoachDto, UpdateCoachDto } from './dto/coach.dto';
import { GrantCoachPortalAccessDto } from './dto/grant-portal-access.dto';
import { CreateCoachQualificationDto } from './dto/coach-qualification.dto';
import { CreateCoachAssignmentDto, EndCoachAssignmentDto } from './dto/coach-assignment.dto';
export declare class CoachesService {
    private readonly prisma;
    private readonly authService;
    constructor(prisma: PrismaService, authService: AuthService);
    findAll(search?: string): Promise<({
        user: {
            id: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
            email: string;
        } | null;
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
            email: string;
        } | null;
        qualifications: {
            id: string;
            createdAt: Date;
            title: string;
            coachId: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
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
            } | null;
            trainingGroup: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                branchId: string | null;
                isActive: boolean;
                teamId: string;
                primaryCoachId: string | null;
            } | null;
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
    }>;
    create(dto: CreateCoachDto): import(".prisma/client").Prisma.Prisma__CoachClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateCoachDto): Promise<{
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
    }>;
    grantPortalAccess(id: string, dto: GrantCoachPortalAccessDto): Promise<{
        user: {
            id: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
            email: string;
        } | null;
        qualifications: {
            id: string;
            createdAt: Date;
            title: string;
            coachId: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
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
            } | null;
            trainingGroup: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                branchId: string | null;
                isActive: boolean;
                teamId: string;
                primaryCoachId: string | null;
            } | null;
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
    }>;
    addQualification(coachId: string, dto: CreateCoachQualificationDto): Promise<{
        user: {
            id: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
            email: string;
        } | null;
        qualifications: {
            id: string;
            createdAt: Date;
            title: string;
            coachId: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
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
            } | null;
            trainingGroup: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                branchId: string | null;
                isActive: boolean;
                teamId: string;
                primaryCoachId: string | null;
            } | null;
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
    }>;
    addAssignment(coachId: string, dto: CreateCoachAssignmentDto): Promise<{
        user: {
            id: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
            email: string;
        } | null;
        qualifications: {
            id: string;
            createdAt: Date;
            title: string;
            coachId: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
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
            } | null;
            trainingGroup: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                branchId: string | null;
                isActive: boolean;
                teamId: string;
                primaryCoachId: string | null;
            } | null;
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
    }>;
    endAssignment(coachId: string, assignmentId: string, dto: EndCoachAssignmentDto): Promise<{
        user: {
            id: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
            email: string;
        } | null;
        qualifications: {
            id: string;
            createdAt: Date;
            title: string;
            coachId: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
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
            } | null;
            trainingGroup: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                branchId: string | null;
                isActive: boolean;
                teamId: string;
                primaryCoachId: string | null;
            } | null;
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
    }>;
}
