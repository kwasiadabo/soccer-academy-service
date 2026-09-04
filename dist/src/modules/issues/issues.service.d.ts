import { IssueStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { CreateIssueDto } from './dto/create-issue.dto';
export declare class IssuesService {
    private readonly prisma;
    private readonly guardianContext;
    constructor(prisma: PrismaService, guardianContext: GuardianContextService);
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
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IssueStatus;
        subject: string;
        guardianId: string;
        submittedByUserId: string;
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
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IssueStatus;
        subject: string;
        guardianId: string;
        submittedByUserId: string;
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
            message: string;
            readAt: Date | null;
            isStaffReply: boolean;
            issueId: string;
            authorUserId: string;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IssueStatus;
        subject: string;
        guardianId: string;
        submittedByUserId: string;
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
            message: string;
            readAt: Date | null;
            isStaffReply: boolean;
            issueId: string;
            authorUserId: string;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IssueStatus;
        subject: string;
        guardianId: string;
        submittedByUserId: string;
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
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IssueStatus;
        subject: string;
        guardianId: string;
        submittedByUserId: string;
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
            message: string;
            readAt: Date | null;
            isStaffReply: boolean;
            issueId: string;
            authorUserId: string;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IssueStatus;
        subject: string;
        guardianId: string;
        submittedByUserId: string;
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
            message: string;
            readAt: Date | null;
            isStaffReply: boolean;
            issueId: string;
            authorUserId: string;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IssueStatus;
        subject: string;
        guardianId: string;
        submittedByUserId: string;
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
            message: string;
            readAt: Date | null;
            isStaffReply: boolean;
            issueId: string;
            authorUserId: string;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.IssueStatus;
        subject: string;
        guardianId: string;
        submittedByUserId: string;
    }>;
}
