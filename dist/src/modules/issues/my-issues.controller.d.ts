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
        academyId: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
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
        academyId: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
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
            academyId: string;
            createdAt: Date;
            issueId: string;
            authorUserId: string;
            isStaffReply: boolean;
            message: string;
            readAt: Date | null;
        })[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
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
            academyId: string;
            createdAt: Date;
            issueId: string;
            authorUserId: string;
            isStaffReply: boolean;
            message: string;
            readAt: Date | null;
        })[];
    } & {
        id: string;
        academyId: string;
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
    }>;
}
