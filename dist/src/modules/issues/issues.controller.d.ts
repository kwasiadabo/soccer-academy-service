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
        status: import(".prisma/client").$Enums.IssueStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        academyId: string;
        guardianId: string;
        submittedByUserId: string;
        subject: string;
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
