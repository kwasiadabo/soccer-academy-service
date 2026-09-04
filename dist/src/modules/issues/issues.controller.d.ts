import { RequestUser } from '../auth/types';
import { IssuesService } from './issues.service';
import { CreateIssueMessageDto } from './dto/create-issue-message.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
export declare class IssuesController {
    private readonly issuesService;
    constructor(issuesService: IssuesService);
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
    getOne(id: string): Promise<{
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
    addMessage(id: string, dto: CreateIssueMessageDto, user: RequestUser): Promise<{
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
    updateStatus(id: string, dto: UpdateIssueStatusDto): Promise<{
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
