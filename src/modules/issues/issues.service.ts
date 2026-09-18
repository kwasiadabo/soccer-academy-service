import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IssueStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { CreateIssueDto } from './dto/create-issue.dto';

const AUTHOR_SELECT = { id: true, firstName: true, lastName: true } as const;

const ISSUE_INCLUDE = {
  guardian: { select: { id: true, firstName: true, lastName: true } },
  submittedBy: { select: AUTHOR_SELECT },
} as const;

const MESSAGE_INCLUDE = {
  author: { select: AUTHOR_SELECT },
} as const;

@Injectable()
export class IssuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly guardianContext: GuardianContextService,
    private readonly tenantContext: TenantContextService,
  ) {}

  // --- Parent-facing ---

  async createIssue(userId: string, dto: CreateIssueDto) {
    const academyId = this.tenantContext.getAcademyId();
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    return this.prisma.parentIssue.create({
      data: {
        academyId,
        guardianId,
        submittedByUserId: userId,
        subject: dto.subject,
        description: dto.description,
      },
      include: ISSUE_INCLUDE,
    });
  }

  async listMyIssues(userId: string) {
    const academyId = this.tenantContext.getAcademyId();
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    return this.prisma.parentIssue.findMany({
      where: { guardianId, academyId },
      include: { ...ISSUE_INCLUDE, _count: { select: { messages: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async unreadCount(userId: string): Promise<number> {
    const academyId = this.tenantContext.getAcademyId();
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    return this.prisma.issueMessage.count({
      where: { isStaffReply: true, readAt: null, academyId, issue: { guardianId } },
    });
  }

  private async assertOwnsIssue(guardianId: string, issueId: string) {
    const academyId = this.tenantContext.getAcademyId();
    const issue = await this.prisma.parentIssue.findFirst({ where: { id: issueId, academyId } });
    if (!issue || issue.guardianId !== guardianId) {
      throw new ForbiddenException('This issue does not belong to your account');
    }
    return issue;
  }

  async getMyIssue(userId: string, issueId: string) {
    const academyId = this.tenantContext.getAcademyId();
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    await this.assertOwnsIssue(guardianId, issueId);

    // Opening the thread marks any staff replies on it as read — that's what clears
    // the sidebar badge count.
    await this.prisma.issueMessage.updateMany({
      where: { issueId, isStaffReply: true, readAt: null, academyId },
      data: { readAt: new Date() },
    });

    return this.prisma.parentIssue.findFirstOrThrow({
      where: { id: issueId, academyId },
      include: { ...ISSUE_INCLUDE, messages: { include: MESSAGE_INCLUDE, orderBy: { createdAt: 'asc' } } },
    });
  }

  async addMyMessage(userId: string, issueId: string, message: string) {
    const academyId = this.tenantContext.getAcademyId();
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    const issue = await this.assertOwnsIssue(guardianId, issueId);

    await this.prisma.issueMessage.create({
      data: { academyId, issueId, authorUserId: userId, message, isStaffReply: false },
    });
    // A parent following up re-opens a resolved/closed thread for staff attention.
    if (issue.status === 'RESOLVED' || issue.status === 'CLOSED') {
      await this.prisma.parentIssue.update({ where: { id: issueId, academyId }, data: { status: 'OPEN' } });
    }

    return this.getMyIssue(userId, issueId);
  }

  // --- Staff-facing ---

  async listAll() {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.parentIssue.findMany({
      where: { academyId },
      include: { ...ISSUE_INCLUDE, _count: { select: { messages: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getForStaff(issueId: string) {
    const academyId = this.tenantContext.getAcademyId();
    const issue = await this.prisma.parentIssue.findFirst({
      where: { id: issueId, academyId },
      include: { ...ISSUE_INCLUDE, messages: { include: MESSAGE_INCLUDE, orderBy: { createdAt: 'asc' } } },
    });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    return issue;
  }

  async addStaffMessage(userId: string, issueId: string, message: string) {
    const academyId = this.tenantContext.getAcademyId();
    const issue = await this.prisma.parentIssue.findFirst({ where: { id: issueId, academyId } });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    await this.prisma.issueMessage.create({
      data: { academyId, issueId, authorUserId: userId, message, isStaffReply: true },
    });
    // A staff reply moves an open issue into progress; leave RESOLVED/CLOSED as-is
    // unless the staff member explicitly changes status.
    if (issue.status === 'OPEN') {
      await this.prisma.parentIssue.update({ where: { id: issueId, academyId }, data: { status: 'IN_PROGRESS' } });
    }

    return this.getForStaff(issueId);
  }

  async updateStatus(issueId: string, status: IssueStatus) {
    const academyId = this.tenantContext.getAcademyId();
    const issue = await this.prisma.parentIssue.findFirst({ where: { id: issueId, academyId } });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    await this.prisma.parentIssue.update({ where: { id: issueId, academyId }, data: { status } });
    return this.getForStaff(issueId);
  }
}
