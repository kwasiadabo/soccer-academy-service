import { IssueStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { CreateIssueDto } from './dto/create-issue.dto';
export declare class IssuesService {
    private readonly prisma;
    private readonly guardianContext;
    private readonly tenantContext;
    constructor(prisma: PrismaService, guardianContext: GuardianContextService, tenantContext: TenantContextService);
    createIssue(userId: string, dto: CreateIssueDto): Promise<{
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        academyId: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
    }>;
    listMyIssues(userId: string): Promise<({
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        _count: {
            messages: number;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        academyId: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
    })[]>;
    unreadCount(userId: string): Promise<number>;
    private assertOwnsIssue;
    getMyIssue(userId: string, issueId: string): Promise<{
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        messages: ({
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            message: string;
            issueId: string;
            authorUserId: string;
            isStaffReply: boolean;
            readAt: Date | null;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        academyId: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
    }>;
    addMyMessage(userId: string, issueId: string, message: string): Promise<{
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        messages: ({
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            message: string;
            issueId: string;
            authorUserId: string;
            isStaffReply: boolean;
            readAt: Date | null;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        academyId: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
    }>;
    listAll(): Promise<({
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        _count: {
            messages: number;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        academyId: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
    })[]>;
    getForStaff(issueId: string): Promise<{
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        messages: ({
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            message: string;
            issueId: string;
            authorUserId: string;
            isStaffReply: boolean;
            readAt: Date | null;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        academyId: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
    }>;
    addStaffMessage(userId: string, issueId: string, message: string): Promise<{
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        messages: ({
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            message: string;
            issueId: string;
            authorUserId: string;
            isStaffReply: boolean;
            readAt: Date | null;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        academyId: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
    }>;
    updateStatus(issueId: string, status: IssueStatus): Promise<{
        guardian: {
            id: string;
            firstName: string;
            lastName: string;
        };
        submittedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        messages: ({
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            academyId: string;
            message: string;
            issueId: string;
            authorUserId: string;
            isStaffReply: boolean;
            readAt: Date | null;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        academyId: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
    }>;
}
