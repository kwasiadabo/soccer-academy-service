import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { StorageService } from '../storage/storage.service';
import { computeRemainingBalance } from '../finance/finance.utils';
import { CreateCoachFeedbackDto } from './dto/coach-feedback.dto';

const CHILD_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  playerCode: true,
  status: true,
  dateOfBirth: true,
  photoDocumentId: true,
  ageCategory: { select: { id: true, name: true } },
  team: { select: { id: true, name: true } },
} as const;

@Injectable()
export class ParentPortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly guardianContext: GuardianContextService,
    private readonly storage: StorageService,
  ) {}

  async listChildren(userId: string) {
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    const playerIds = await this.guardianContext.resolvePlayerIds(guardianId);
    return this.prisma.player.findMany({
      where: { id: { in: playerIds }, deletedAt: null },
      select: CHILD_SELECT,
      orderBy: { firstName: 'asc' },
    });
  }

  // Recent Player of the Week picks across every one of this guardian's children, so
  // the "My Children" list and a child's detail page can star whichever child was most
  // recently picked without an N+1 request per child.
  async getPlayerOfTheWeekAwards(userId: string) {
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    const playerIds = await this.guardianContext.resolvePlayerIds(guardianId);
    if (playerIds.length === 0) return [];

    return this.prisma.playerOfTheWeek.findMany({
      where: { playerId: { in: playerIds } },
      include: { team: { select: { name: true } } },
      orderBy: { weekOf: 'desc' },
      take: 20,
    });
  }

  private async assertAccess(userId: string, playerId: string): Promise<string> {
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    await this.guardianContext.assertOwnsPlayer(guardianId, playerId);
    return guardianId;
  }

  async getChild(userId: string, playerId: string) {
    await this.assertAccess(userId, playerId);
    return this.prisma.player.findUniqueOrThrow({ where: { id: playerId }, select: CHILD_SELECT });
  }

  async getPhoto(userId: string, playerId: string): Promise<{ buffer: Buffer; mimeType: string }> {
    await this.assertAccess(userId, playerId);
    const player = await this.prisma.player.findFirst({
      where: { id: playerId, deletedAt: null },
      include: { photo: true },
    });
    if (!player?.photo) {
      throw new NotFoundException('This player has no photo');
    }
    const buffer = await this.storage.read(player.photo.storageKey);
    return { buffer, mimeType: player.photo.mimeType };
  }

  async getCoaches(userId: string, playerId: string) {
    await this.assertAccess(userId, playerId);
    const player = await this.prisma.player.findUniqueOrThrow({
      where: { id: playerId },
      select: { teamId: true, trainingGroupId: true, primaryCoachId: true },
    });

    const assignments = await this.prisma.coachAssignment.findMany({
      where: {
        effectiveTo: null,
        OR: [
          player.teamId ? { teamId: player.teamId } : undefined,
          player.trainingGroupId ? { trainingGroupId: player.trainingGroupId } : undefined,
        ].filter((c): c is NonNullable<typeof c> => !!c),
      },
      select: { coach: { select: { id: true, firstName: true, lastName: true } } },
    });

    const coaches = new Map(assignments.map((a) => [a.coach.id, a.coach]));
    if (player.primaryCoachId) {
      const primaryCoach = await this.prisma.coach.findUnique({
        where: { id: player.primaryCoachId },
        select: { id: true, firstName: true, lastName: true },
      });
      if (primaryCoach) coaches.set(primaryCoach.id, primaryCoach);
    }

    return Array.from(coaches.values());
  }

  async getAttendance(userId: string, playerId: string) {
    await this.assertAccess(userId, playerId);
    return this.prisma.trainingAttendance.findMany({
      where: { playerId },
      include: { trainingSession: { include: { team: true } } },
      orderBy: { recordedAt: 'desc' },
      take: 50,
    });
  }

  async getAssessments(userId: string, playerId: string) {
    await this.assertAccess(userId, playerId);
    return this.prisma.playerAssessment.findMany({
      where: { playerId, deletedAt: null },
      include: {
        ratings: { include: { criteria: true, sessionActivity: true } },
        assessedByCoach: { select: { id: true, firstName: true, lastName: true } },
        template: true,
      },
      orderBy: { assessmentDate: 'desc' },
      take: 50,
    });
  }

  async getActivityMarks(userId: string, playerId: string) {
    await this.assertAccess(userId, playerId);
    return this.prisma.trainingActivityMark.findMany({
      where: { playerId },
      include: {
        trainingActivity: {
          select: { name: true, trainingPlan: { select: { title: true, scheduledDate: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getMatches(userId: string, playerId: string) {
    await this.assertAccess(userId, playerId);
    return this.prisma.matchParticipation.findMany({
      where: { playerId },
      include: { match: { include: { team: true, opponent: true } } },
      orderBy: { match: { matchDate: 'desc' } },
      take: 50,
    });
  }

  async getFinanceSummary(userId: string, playerId: string) {
    await this.assertAccess(userId, playerId);

    const invoices = await this.prisma.invoice.findMany({
      where: { playerId, deletedAt: null },
      include: { allocations: true },
    });
    const payments = await this.prisma.payment.findMany({
      where: { playerId, status: 'COMPLETED' },
    });

    let totalDue = 0;
    let nextDueDate: Date | null = null;
    let hasOverdue = false;
    const now = new Date();

    for (const invoice of invoices) {
      const remaining = computeRemainingBalance(invoice);
      if (remaining > 0.01) {
        totalDue += remaining;
        if (!nextDueDate || invoice.dueDate < nextDueDate) {
          nextDueDate = invoice.dueDate;
        }
        if (invoice.dueDate < now) {
          hasOverdue = true;
        }
      }
    }

    const paidToDate = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const status = totalDue <= 0.01 ? 'UP_TO_DATE' : hasOverdue ? 'OVERDUE' : 'PENDING';

    return {
      totalDue: Math.round(totalDue * 100) / 100,
      paidToDate: Math.round(paidToDate * 100) / 100,
      nextDueDate,
      status,
    };
  }

  async getStatement(userId: string, playerId: string) {
    await this.assertAccess(userId, playerId);

    const invoices = await this.prisma.invoice.findMany({
      where: { playerId, deletedAt: null },
      include: { feeType: true, allocations: true },
      orderBy: { issuedAt: 'asc' },
    });

    const paymentAllocations = await this.prisma.paymentAllocation.findMany({
      where: { payment: { playerId, status: 'COMPLETED' } },
      include: {
        payment: true,
        invoice: { include: { feeType: true } },
      },
      orderBy: { payment: { paidAt: 'asc' } },
    });

    return {
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        issuedAt: invoice.issuedAt,
        dueDate: invoice.dueDate,
        amount: Number(invoice.amount),
        discountAmount: Number(invoice.discountAmount),
        remaining: computeRemainingBalance(invoice),
        status: invoice.status,
        feeTypeName: invoice.feeType.name,
      })),
      payments: paymentAllocations.map((a) => ({
        paymentId: a.payment.id,
        invoiceId: a.invoice.id,
        receiptNumber: a.payment.receiptNumber,
        paidAt: a.payment.paidAt,
        method: a.payment.method,
        amount: Number(a.amount),
        feeTypeName: a.invoice.feeType.name,
        invoiceNumber: a.invoice.invoiceNumber,
      })),
    };
  }

  async submitFeedback(userId: string, playerId: string, dto: CreateCoachFeedbackDto) {
    await this.assertAccess(userId, playerId);

    const { criteria, ...rest } = dto;
    return this.prisma.coachFeedback.create({
      data: {
        ...rest,
        playerId,
        submittedByUserId: userId,
        criteria: criteria?.length ? { create: criteria } : undefined,
      },
      include: { criteria: true },
    });
  }
}
