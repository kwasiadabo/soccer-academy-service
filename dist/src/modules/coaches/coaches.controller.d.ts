import { CoachesService } from './coaches.service';
import { CreateCoachDto, UpdateCoachDto } from './dto/coach.dto';
import { GrantCoachPortalAccessDto } from './dto/grant-portal-access.dto';
import { CreateCoachQualificationDto } from './dto/coach-qualification.dto';
import { CreateCoachAssignmentDto, EndCoachAssignmentDto } from './dto/coach-assignment.dto';
export declare class CoachesController {
    private readonly coachesService;
    constructor(coachesService: CoachesService);
    findAll(search?: string): Promise<({
        user: {
            id: string;
            email: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
        } | null;
    } & {
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        role: import(".prisma/client").$Enums.StaffRole;
        middleName: string | null;
        bio: string | null;
        isActive: boolean;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
        } | null;
        qualifications: {
            id: string;
            academyId: string;
            createdAt: Date;
            coachId: string;
            title: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
            team: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                ageCategoryId: string;
                isActive: boolean;
                branchId: string | null;
                seasonId: string;
                headCoachId: string | null;
            } | null;
            trainingGroup: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                teamId: string;
                primaryCoachId: string | null;
                isActive: boolean;
                branchId: string | null;
            } | null;
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.CoachAssignmentRole;
            teamId: string | null;
            trainingGroupId: string | null;
            coachId: string;
            effectiveFrom: Date;
            effectiveTo: Date | null;
        })[];
    } & {
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        role: import(".prisma/client").$Enums.StaffRole;
        middleName: string | null;
        bio: string | null;
        isActive: boolean;
    }>;
    create(dto: CreateCoachDto): import(".prisma/client").Prisma.Prisma__CoachClient<{
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        role: import(".prisma/client").$Enums.StaffRole;
        middleName: string | null;
        bio: string | null;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateCoachDto): Promise<{
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        role: import(".prisma/client").$Enums.StaffRole;
        middleName: string | null;
        bio: string | null;
        isActive: boolean;
    }>;
    grantPortalAccess(id: string, dto: GrantCoachPortalAccessDto): Promise<{
        user: {
            id: string;
            email: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
        } | null;
        qualifications: {
            id: string;
            academyId: string;
            createdAt: Date;
            coachId: string;
            title: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
            team: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                ageCategoryId: string;
                isActive: boolean;
                branchId: string | null;
                seasonId: string;
                headCoachId: string | null;
            } | null;
            trainingGroup: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                teamId: string;
                primaryCoachId: string | null;
                isActive: boolean;
                branchId: string | null;
            } | null;
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.CoachAssignmentRole;
            teamId: string | null;
            trainingGroupId: string | null;
            coachId: string;
            effectiveFrom: Date;
            effectiveTo: Date | null;
        })[];
    } & {
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        role: import(".prisma/client").$Enums.StaffRole;
        middleName: string | null;
        bio: string | null;
        isActive: boolean;
    }>;
    addQualification(id: string, dto: CreateCoachQualificationDto): Promise<{
        user: {
            id: string;
            email: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
        } | null;
        qualifications: {
            id: string;
            academyId: string;
            createdAt: Date;
            coachId: string;
            title: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
            team: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                ageCategoryId: string;
                isActive: boolean;
                branchId: string | null;
                seasonId: string;
                headCoachId: string | null;
            } | null;
            trainingGroup: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                teamId: string;
                primaryCoachId: string | null;
                isActive: boolean;
                branchId: string | null;
            } | null;
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.CoachAssignmentRole;
            teamId: string | null;
            trainingGroupId: string | null;
            coachId: string;
            effectiveFrom: Date;
            effectiveTo: Date | null;
        })[];
    } & {
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        role: import(".prisma/client").$Enums.StaffRole;
        middleName: string | null;
        bio: string | null;
        isActive: boolean;
    }>;
    addAssignment(id: string, dto: CreateCoachAssignmentDto): Promise<{
        user: {
            id: string;
            email: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
        } | null;
        qualifications: {
            id: string;
            academyId: string;
            createdAt: Date;
            coachId: string;
            title: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
            team: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                ageCategoryId: string;
                isActive: boolean;
                branchId: string | null;
                seasonId: string;
                headCoachId: string | null;
            } | null;
            trainingGroup: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                teamId: string;
                primaryCoachId: string | null;
                isActive: boolean;
                branchId: string | null;
            } | null;
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.CoachAssignmentRole;
            teamId: string | null;
            trainingGroupId: string | null;
            coachId: string;
            effectiveFrom: Date;
            effectiveTo: Date | null;
        })[];
    } & {
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        role: import(".prisma/client").$Enums.StaffRole;
        middleName: string | null;
        bio: string | null;
        isActive: boolean;
    }>;
    endAssignment(id: string, assignmentId: string, dto: EndCoachAssignmentDto): Promise<{
        user: {
            id: string;
            email: string;
            roles: {
                role: {
                    name: string;
                };
            }[];
        } | null;
        qualifications: {
            id: string;
            academyId: string;
            createdAt: Date;
            coachId: string;
            title: string;
            issuingBody: string | null;
            issueDate: Date | null;
            expiryDate: Date | null;
            documentId: string | null;
        }[];
        assignments: ({
            team: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                ageCategoryId: string;
                isActive: boolean;
                branchId: string | null;
                seasonId: string;
                headCoachId: string | null;
            } | null;
            trainingGroup: {
                id: string;
                academyId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                teamId: string;
                primaryCoachId: string | null;
                isActive: boolean;
                branchId: string | null;
            } | null;
        } & {
            id: string;
            academyId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.CoachAssignmentRole;
            teamId: string | null;
            trainingGroupId: string | null;
            coachId: string;
            effectiveFrom: Date;
            effectiveTo: Date | null;
        })[];
    } & {
        id: string;
        academyId: string;
        email: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string | null;
        role: import(".prisma/client").$Enums.StaffRole;
        middleName: string | null;
        bio: string | null;
        isActive: boolean;
    }>;
}
