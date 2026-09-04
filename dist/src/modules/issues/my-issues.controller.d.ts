import { RequestUser } from '../auth/types';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { CreateIssueMessageDto } from './dto/create-issue-message.dto';
export declare class MyIssuesController {
    private readonly issuesService;
    constructor(issuesService: IssuesService);
    listMine(user: RequestUser): Promise<({
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
    unreadCount(user: RequestUser): Promise<number>;
    create(dto: CreateIssueDto, user: RequestUser): Promise<{
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
    getOne(id: string, user: RequestUser): Promise<{
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
}
