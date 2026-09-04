"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const guardian_context_service_1 = require("../guardians/guardian-context.service");
const AUTHOR_SELECT = { id: true, firstName: true, lastName: true };
const ISSUE_INCLUDE = {
    guardian: { select: { id: true, firstName: true, lastName: true } },
    submittedBy: { select: AUTHOR_SELECT },
};
const MESSAGE_INCLUDE = {
    author: { select: AUTHOR_SELECT },
};
let IssuesService = class IssuesService {
    constructor(prisma, guardianContext) {
        this.prisma = prisma;
        this.guardianContext = guardianContext;
    }
    async createIssue(userId, dto) {
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        return this.prisma.parentIssue.create({
            data: {
                guardianId,
                submittedByUserId: userId,
                subject: dto.subject,
                description: dto.description,
            },
            include: ISSUE_INCLUDE,
        });
    }
    async listMyIssues(userId) {
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        return this.prisma.parentIssue.findMany({
            where: { guardianId },
            include: { ...ISSUE_INCLUDE, _count: { select: { messages: true } } },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async unreadCount(userId) {
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        return this.prisma.issueMessage.count({
            where: { isStaffReply: true, readAt: null, issue: { guardianId } },
        });
    }
    async assertOwnsIssue(guardianId, issueId) {
        const issue = await this.prisma.parentIssue.findUnique({ where: { id: issueId } });
        if (!issue || issue.guardianId !== guardianId) {
            throw new common_1.ForbiddenException('This issue does not belong to your account');
        }
        return issue;
    }
    async getMyIssue(userId, issueId) {
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        await this.assertOwnsIssue(guardianId, issueId);
        await this.prisma.issueMessage.updateMany({
            where: { issueId, isStaffReply: true, readAt: null },
            data: { readAt: new Date() },
        });
        return this.prisma.parentIssue.findUniqueOrThrow({
            where: { id: issueId },
            include: { ...ISSUE_INCLUDE, messages: { include: MESSAGE_INCLUDE, orderBy: { createdAt: 'asc' } } },
        });
    }
    async addMyMessage(userId, issueId, message) {
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        const issue = await this.assertOwnsIssue(guardianId, issueId);
        await this.prisma.issueMessage.create({
            data: { issueId, authorUserId: userId, message, isStaffReply: false },
        });
        if (issue.status === 'RESOLVED' || issue.status === 'CLOSED') {
            await this.prisma.parentIssue.update({ where: { id: issueId }, data: { status: 'OPEN' } });
        }
        return this.getMyIssue(userId, issueId);
    }
    async listAll() {
        return this.prisma.parentIssue.findMany({
            include: { ...ISSUE_INCLUDE, _count: { select: { messages: true } } },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getForStaff(issueId) {
        const issue = await this.prisma.parentIssue.findUnique({
            where: { id: issueId },
            include: { ...ISSUE_INCLUDE, messages: { include: MESSAGE_INCLUDE, orderBy: { createdAt: 'asc' } } },
        });
        if (!issue) {
            throw new common_1.NotFoundException('Issue not found');
        }
        return issue;
    }
    async addStaffMessage(userId, issueId, message) {
        const issue = await this.prisma.parentIssue.findUnique({ where: { id: issueId } });
        if (!issue) {
            throw new common_1.NotFoundException('Issue not found');
        }
        await this.prisma.issueMessage.create({
            data: { issueId, authorUserId: userId, message, isStaffReply: true },
        });
        if (issue.status === 'OPEN') {
            await this.prisma.parentIssue.update({ where: { id: issueId }, data: { status: 'IN_PROGRESS' } });
        }
        return this.getForStaff(issueId);
    }
    async updateStatus(issueId, status) {
        const issue = await this.prisma.parentIssue.findUnique({ where: { id: issueId } });
        if (!issue) {
            throw new common_1.NotFoundException('Issue not found');
        }
        await this.prisma.parentIssue.update({ where: { id: issueId }, data: { status } });
        return this.getForStaff(issueId);
    }
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        guardian_context_service_1.GuardianContextService])
], IssuesService);
//# sourceMappingURL=issues.service.js.map