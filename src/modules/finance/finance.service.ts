import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlayersService } from '../players/players.service';
import { ReceiptsService } from '../receipts/receipts.service';
import { CreateFeeTypeDto, UpdateFeeTypeDto } from './dto/fee-type.dto';
import { CreateFeeItemDto, UpdateFeeItemDto } from './dto/fee-item.dto';
import { CreateInvoiceDto } from './dto/invoice.dto';
import { CreatePaymentDto } from './dto/payment.dto';
import { computeRemainingBalance, generateInvoiceNumber, generateReceiptNumber, monthsBetween } from './finance.utils';

const FEE_TYPE_INCLUDE = {
  items: { include: { feeItem: true } },
} satisfies Prisma.FeeTypeInclude;

const INVOICE_INCLUDE = {
  feeType: { include: FEE_TYPE_INCLUDE },
  allocations: true,
} satisfies Prisma.InvoiceInclude;

export interface DebtorRow {
  player: { id: string; firstName: string; lastName: string; playerCode: string | null; status: string };
  invoices: { id: string; invoiceNumber: string; feeTypeName: string; dueDate: Date; remaining: number; isOverdue: boolean }[];
  totalOwed: number;
  hasOverdue: boolean;
}

export interface DebtorAgingRow extends DebtorRow {
  oldestDueDate: Date;
  monthsOwing: number;
}

export interface PaymentReportRow {
  paymentId: string;
  receiptNumber: string;
  paidAt: Date;
  method: string;
  reference: string | null;
  player: { id: string; firstName: string; lastName: string };
  invoiceId: string;
  invoiceNumber: string;
  feeTypeId: string;
  feeTypeName: string;
  feeTypeCategory: string;
  amount: number;
}

export interface PaymentReport {
  rows: PaymentReportRow[];
  summary: {
    totalAmount: number;
    count: number;
    byFeeType: { feeTypeId: string; feeTypeName: string; total: number }[];
    byMethod: { method: string; total: number }[];
  };
}

export interface MonthlyBillingRow {
  id: string;
  invoiceNumber: string;
  player: { id: string; firstName: string; lastName: string; playerCode: string | null; status: string };
  feeTypeId: string;
  feeTypeName: string;
  amount: number;
  remaining: number;
  dueDate: Date;
  issuedAt: Date;
  status: string;
}

export interface MonthlyBillingReport {
  month: string;
  rows: MonthlyBillingRow[];
  summary: { totalBilled: number; totalCollected: number; totalOutstanding: number; count: number };
}

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
    private readonly receipts: ReceiptsService,
  ) {}

  // --- Fee items (raw priced building blocks, no category of their own) ---
  findAllFeeItems(includeInactive = false) {
    return this.prisma.feeItem.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  createFeeItem(dto: CreateFeeItemDto) {
    return this.prisma.feeItem.create({ data: dto });
  }

  async updateFeeItem(id: string, dto: UpdateFeeItemDto) {
    const feeItem = await this.prisma.feeItem.findUnique({ where: { id } });
    if (!feeItem) {
      throw new NotFoundException('Fee item not found');
    }
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.feeItem.update({ where: { id }, data: dto });
      if (dto.defaultAmount !== undefined) {
        // Every Fee this item is attached to needs its cached total refreshed.
        const links = await tx.feeTypeItem.findMany({ where: { feeItemId: id }, select: { feeTypeId: true } });
        for (const link of links) {
          await this.recomputeFeeTypeAmount(tx, link.feeTypeId);
        }
      }
      return updated;
    });
  }

  // --- Fee types (chargeable Fees composed of Fee Items) ---
  findAllFeeTypes(includeInactive = false) {
    return this.prisma.feeType.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: FEE_TYPE_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  // Player registration picks whichever REGISTRATION fee type is active via a plain
  // findFirst (see players.service.ts#approve) — at most one may be active at a time
  // so that lookup is never ambiguous.
  private async deactivateOtherRegistrationFeeTypes(tx: Prisma.TransactionClient, excludeId?: string) {
    await tx.feeType.updateMany({
      where: { category: 'REGISTRATION', isActive: true, ...(excludeId ? { id: { not: excludeId } } : {}) },
      data: { isActive: false },
    });
  }

  private async recomputeFeeTypeAmount(tx: Prisma.TransactionClient, feeTypeId: string) {
    const items = await tx.feeTypeItem.findMany({ where: { feeTypeId }, include: { feeItem: true } });
    const total = items.reduce((sum, link) => sum + Number(link.feeItem.defaultAmount), 0);
    await tx.feeType.update({ where: { id: feeTypeId }, data: { defaultAmount: total } });
  }

  async createFeeType(dto: CreateFeeTypeDto) {
    if (dto.category === 'REGISTRATION') {
      return this.prisma.$transaction(async (tx) => {
        await this.deactivateOtherRegistrationFeeTypes(tx);
        return tx.feeType.create({ data: dto, include: FEE_TYPE_INCLUDE });
      });
    }
    return this.prisma.feeType.create({ data: dto, include: FEE_TYPE_INCLUDE });
  }

  async updateFeeType(id: string, dto: UpdateFeeTypeDto) {
    const feeType = await this.prisma.feeType.findUnique({ where: { id } });
    if (!feeType) {
      throw new NotFoundException('Fee type not found');
    }
    const activating = dto.isActive === true && !feeType.isActive;
    if (activating && feeType.category === 'REGISTRATION') {
      return this.prisma.$transaction(async (tx) => {
        await this.deactivateOtherRegistrationFeeTypes(tx, id);
        return tx.feeType.update({ where: { id }, data: dto, include: FEE_TYPE_INCLUDE });
      });
    }
    return this.prisma.feeType.update({ where: { id }, data: dto, include: FEE_TYPE_INCLUDE });
  }

  async addFeeTypeItem(feeTypeId: string, feeItemId: string) {
    const [feeType, feeItem] = await Promise.all([
      this.prisma.feeType.findUnique({ where: { id: feeTypeId } }),
      this.prisma.feeItem.findUnique({ where: { id: feeItemId } }),
    ]);
    if (!feeType) throw new NotFoundException('Fee not found');
    if (!feeItem) throw new NotFoundException('Fee item not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.feeTypeItem.upsert({
        where: { feeTypeId_feeItemId: { feeTypeId, feeItemId } },
        create: { feeTypeId, feeItemId },
        update: {},
      });
      await this.recomputeFeeTypeAmount(tx, feeTypeId);
      return tx.feeType.findUniqueOrThrow({ where: { id: feeTypeId }, include: FEE_TYPE_INCLUDE });
    });
  }

  async removeFeeTypeItem(feeTypeId: string, feeItemId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.feeTypeItem.deleteMany({ where: { feeTypeId, feeItemId } });
      await this.recomputeFeeTypeAmount(tx, feeTypeId);
      return tx.feeType.findUniqueOrThrow({ where: { id: feeTypeId }, include: FEE_TYPE_INCLUDE });
    });
  }

  // --- Invoices ---
  findInvoicesForPlayer(playerId: string) {
    return this.prisma.invoice.findMany({
      where: { playerId, deletedAt: null },
      include: INVOICE_INCLUDE,
      orderBy: { issuedAt: 'desc' },
    });
  }

  async createInvoice(dto: CreateInvoiceDto) {
    const feeType = await this.prisma.feeType.findFirst({ where: { id: dto.feeTypeId, isActive: true } });
    if (!feeType) {
      throw new BadRequestException('Fee type not found or inactive');
    }
    const player = await this.prisma.player.findFirst({ where: { id: dto.playerId, deletedAt: null } });
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return this.prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        playerId: dto.playerId,
        feeTypeId: dto.feeTypeId,
        description: dto.description,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        gracePeriodDays: dto.gracePeriodDays ?? 0,
        status: 'PENDING',
      },
      include: INVOICE_INCLUDE,
    });
  }

  // --- Payments ---
  async createPayment(dto: CreatePaymentDto, receivedByUserId: string) {
    const invoiceIds = dto.allocations.map((a) => a.invoiceId);
    const invoices = await this.prisma.invoice.findMany({
      where: { id: { in: invoiceIds }, playerId: dto.playerId, deletedAt: null },
      include: INVOICE_INCLUDE,
    });
    if (invoices.length !== new Set(invoiceIds).size) {
      throw new BadRequestException('One or more invoices were not found for this player');
    }

    for (const allocation of dto.allocations) {
      const invoice = invoices.find((inv) => inv.id === allocation.invoiceId)!;
      const remaining = computeRemainingBalance(invoice);
      if (allocation.amount > remaining + 0.01) {
        throw new BadRequestException(
          `Allocation of ${allocation.amount} exceeds the remaining balance of ${remaining.toFixed(2)} on invoice ${invoice.invoiceNumber}`,
        );
      }
    }

    const totalAmount = dto.allocations.reduce((sum, a) => sum + a.amount, 0);

    const payment = await this.prisma.payment.create({
      data: {
        receiptNumber: generateReceiptNumber(),
        playerId: dto.playerId,
        amount: totalAmount,
        method: dto.method,
        reference: dto.reference,
        receivedByUserId,
        allocations: { create: dto.allocations.map((a) => ({ invoiceId: a.invoiceId, amount: a.amount })) },
      },
      include: { allocations: true },
    });

    await this.prisma.$transaction(
      dto.allocations.map((allocation) => {
        const invoice = invoices.find((inv) => inv.id === allocation.invoiceId)!;
        const remainingAfter = computeRemainingBalance(invoice) - allocation.amount;
        const status = remainingAfter <= 0.01 ? 'PAID' : 'PARTIALLY_PAID';
        return this.prisma.invoice.update({ where: { id: invoice.id }, data: { status } });
      }),
    );

    // If this payment happened to fully settle the player's registration invoice
    // (e.g. paid from the Financial tab rather than the dedicated registration flow),
    // move them to ACTIVE the same way the dedicated flow would.
    await this.playersService.activateAfterRegistrationPayment(dto.playerId);
    await this.receipts.sendPaymentReceipt(payment.id);

    return payment;
  }

  // --- Dashboard stats ---
  async getTeamStats() {
    const players = await this.prisma.player.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      select: { id: true, teamId: true, team: { select: { id: true, name: true } } },
    });

    const monthlyInvoices = players.length
      ? await this.prisma.invoice.findMany({
          where: {
            deletedAt: null,
            feeType: { category: 'MONTHLY_SUBSCRIPTION' },
            status: { in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'] },
            playerId: { in: players.map((p) => p.id) },
          },
          include: { allocations: true },
        })
      : [];

    const owingByPlayer = new Set<string>();
    for (const invoice of monthlyInvoices) {
      if (computeRemainingBalance(invoice) > 0.01) owingByPlayer.add(invoice.playerId);
    }

    interface Bucket {
      teamId: string | null;
      teamName: string;
      activePlayers: number;
      owingMonthlySubscription: number;
    }
    const buckets = new Map<string, Bucket>();
    for (const player of players) {
      const key = player.teamId ?? 'unassigned';
      const bucket = buckets.get(key) ?? {
        teamId: player.teamId,
        teamName: player.team?.name ?? 'No team assigned',
        activePlayers: 0,
        owingMonthlySubscription: 0,
      };
      bucket.activePlayers += 1;
      if (owingByPlayer.has(player.id)) bucket.owingMonthlySubscription += 1;
      buckets.set(key, bucket);
    }

    const teams = Array.from(buckets.values())
      .map((b) => ({ ...b, paidUpToDate: b.activePlayers - b.owingMonthlySubscription }))
      .sort((a, b) => b.activePlayers - a.activePlayers);

    const totals = teams.reduce(
      (acc, t) => ({
        activePlayers: acc.activePlayers + t.activePlayers,
        owingMonthlySubscription: acc.owingMonthlySubscription + t.owingMonthlySubscription,
        paidUpToDate: acc.paidUpToDate + t.paidUpToDate,
      }),
      { activePlayers: 0, owingMonthlySubscription: 0, paidUpToDate: 0 },
    );

    return { teams, totals };
  }

  // --- Debtors ---
  async listDebtors() {
    const invoices = await this.prisma.invoice.findMany({
      where: { deletedAt: null, status: { in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'] } },
      include: {
        ...INVOICE_INCLUDE,
        player: { select: { id: true, firstName: true, lastName: true, playerCode: true, status: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    const now = new Date();
    const byPlayer = new Map<string, DebtorRow>();

    for (const invoice of invoices) {
      const remaining = computeRemainingBalance(invoice);
      if (remaining <= 0.01) continue;

      const isOverdue = invoice.dueDate < now;
      const row = byPlayer.get(invoice.playerId) ?? {
        player: invoice.player,
        invoices: [],
        totalOwed: 0,
        hasOverdue: false,
      };
      row.invoices.push({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        feeTypeName: invoice.feeType.name,
        dueDate: invoice.dueDate,
        remaining,
        isOverdue,
      });
      row.totalOwed += remaining;
      row.hasOverdue = row.hasOverdue || isOverdue;
      byPlayer.set(invoice.playerId, row);
    }

    return Array.from(byPlayer.values()).sort((a, b) => b.totalOwed - a.totalOwed);
  }

  // Months owing = whole months elapsed since the oldest unpaid invoice's due
  // date. `invoices[0]` is the oldest since listDebtors builds each player's
  // list while iterating invoices globally sorted by dueDate ascending.
  async getDebtorsAging(minMonths = 0): Promise<DebtorAgingRow[]> {
    const debtors = await this.listDebtors();
    const now = new Date();

    return debtors
      .map((row) => {
        const oldestDueDate = row.invoices[0].dueDate;
        return { ...row, oldestDueDate, monthsOwing: monthsBetween(oldestDueDate, now) };
      })
      .filter((row) => row.monthsOwing >= minMonths)
      .sort((a, b) => b.monthsOwing - a.monthsOwing || b.totalOwed - a.totalOwed);
  }

  // --- Payments report ---
  async getPaymentsReport(from?: string, to?: string, feeTypeId?: string, playerId?: string): Promise<PaymentReport> {
    const paidAt: Prisma.DateTimeFilter = {};
    if (from) paidAt.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      paidAt.lte = end;
    }

    const allocations = await this.prisma.paymentAllocation.findMany({
      where: {
        payment: {
          status: 'COMPLETED',
          ...(from || to ? { paidAt } : {}),
          ...(playerId ? { playerId } : {}),
        },
        ...(feeTypeId ? { invoice: { feeTypeId } } : {}),
      },
      include: {
        payment: { include: { player: { select: { id: true, firstName: true, lastName: true } } } },
        invoice: { include: { feeType: true } },
      },
      orderBy: { payment: { paidAt: 'desc' } },
    });

    const rows: PaymentReportRow[] = allocations.map((a) => ({
      paymentId: a.payment.id,
      receiptNumber: a.payment.receiptNumber,
      paidAt: a.payment.paidAt,
      method: a.payment.method,
      reference: a.payment.reference,
      player: a.payment.player,
      invoiceId: a.invoice.id,
      invoiceNumber: a.invoice.invoiceNumber,
      feeTypeId: a.invoice.feeType.id,
      feeTypeName: a.invoice.feeType.name,
      feeTypeCategory: a.invoice.feeType.category,
      amount: Number(a.amount),
    }));

    const byFeeTypeMap = new Map<string, { feeTypeId: string; feeTypeName: string; total: number }>();
    const byMethodMap = new Map<string, number>();
    let totalAmount = 0;

    for (const row of rows) {
      totalAmount += row.amount;
      const feeTypeEntry = byFeeTypeMap.get(row.feeTypeId) ?? {
        feeTypeId: row.feeTypeId,
        feeTypeName: row.feeTypeName,
        total: 0,
      };
      feeTypeEntry.total += row.amount;
      byFeeTypeMap.set(row.feeTypeId, feeTypeEntry);
      byMethodMap.set(row.method, (byMethodMap.get(row.method) ?? 0) + row.amount);
    }

    return {
      rows,
      summary: {
        totalAmount,
        count: rows.length,
        byFeeType: Array.from(byFeeTypeMap.values()).sort((a, b) => b.total - a.total),
        byMethod: Array.from(byMethodMap.entries()).map(([method, total]) => ({ method, total })),
      },
    };
  }

  // --- Recurring billing ---
  // Runs at 00:00 on the 1st of each month. No per-fee billing day exists
  // (FeeStructure is deferred) — every recurring FeeType bills every ACTIVE
  // player its flat defaultAmount on the same day.
  @Cron('0 0 1 * *')
  async handleMonthlyBillingCron() {
    const result = await this.generateRecurringInvoices();
    this.logger.log(`Monthly billing cron: created ${result.created} invoice(s), skipped ${result.skipped} already-billed.`);
  }

  async generateRecurringInvoices(): Promise<{ created: number; skipped: number }> {
    const recurringFeeTypes = await this.prisma.feeType.findMany({
      where: { isRecurring: true, isActive: true },
    });
    if (recurringFeeTypes.length === 0) {
      return { created: 0, skipped: 0 };
    }

    const activePlayers = await this.prisma.player.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      select: { id: true },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let created = 0;
    let skipped = 0;

    for (const feeType of recurringFeeTypes) {
      for (const player of activePlayers) {
        const alreadyBilled = await this.prisma.invoice.findFirst({
          where: {
            playerId: player.id,
            feeTypeId: feeType.id,
            issuedAt: { gte: startOfMonth },
            deletedAt: null,
          },
        });
        if (alreadyBilled) {
          skipped++;
          continue;
        }

        const dueDate = new Date(now);
        dueDate.setDate(dueDate.getDate() + 7);

        await this.prisma.invoice.create({
          data: {
            invoiceNumber: generateInvoiceNumber(),
            playerId: player.id,
            feeTypeId: feeType.id,
            amount: feeType.defaultAmount,
            dueDate,
            status: 'PENDING',
          },
        });
        created++;
      }
    }

    return { created, skipped };
  }

  // Lists every invoice a recurring FeeType (e.g. Monthly Subscription) has generated
  // for the given month via the monthly cron — scoped to FeeTypes that are still active,
  // so a retired/duplicate FeeType (see the August 2026 GHS 50 vs GHS 300 Monthly
  // Subscription mixup) doesn't keep showing every player billed twice after it's
  // deactivated.
  async getMonthlyBilling(month?: string): Promise<MonthlyBillingReport> {
    const reference = month ? new Date(`${month}-01T00:00:00`) : new Date();
    const startOfMonth = new Date(reference.getFullYear(), reference.getMonth(), 1);
    const startOfNextMonth = new Date(reference.getFullYear(), reference.getMonth() + 1, 1);
    const monthKey = `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}`;

    const invoices = await this.prisma.invoice.findMany({
      where: {
        deletedAt: null,
        feeType: { isRecurring: true, isActive: true },
        issuedAt: { gte: startOfMonth, lt: startOfNextMonth },
      },
      include: {
        ...INVOICE_INCLUDE,
        player: { select: { id: true, firstName: true, lastName: true, playerCode: true, status: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });

    const rows: MonthlyBillingRow[] = invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      player: invoice.player,
      feeTypeId: invoice.feeType.id,
      feeTypeName: invoice.feeType.name,
      amount: Number(invoice.amount),
      remaining: computeRemainingBalance(invoice),
      dueDate: invoice.dueDate,
      issuedAt: invoice.issuedAt,
      status: invoice.status,
    }));

    const totalBilled = rows.reduce((sum, r) => sum + r.amount, 0);
    const totalOutstanding = rows.reduce((sum, r) => sum + r.remaining, 0);

    return {
      month: monthKey,
      rows,
      summary: {
        totalBilled,
        totalCollected: totalBilled - totalOutstanding,
        totalOutstanding,
        count: rows.length,
      },
    };
  }

  // --- Reminders ---
  // No email/SMS provider is wired up yet — mirrors AuthService.requestPasswordReset's
  // stub exactly. Records an in-app Notification when the guardian has a portal
  // login; otherwise just logs it. Never claims a real message was sent.
  async sendPaymentReminder(playerId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, playerId, deletedAt: null },
      include: {
        feeType: true,
        player: {
          include: { guardians: { where: { isPrimary: true }, include: { guardian: true } } },
        },
      },
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found for this player');
    }

    const primaryGuardian = invoice.player.guardians[0]?.guardian;
    const title = `Payment reminder: ${invoice.feeType.name}`;
    const body = `A payment of GHS ${Number(invoice.amount).toFixed(2)} for ${invoice.player.firstName} ${invoice.player.lastName} is due ${invoice.dueDate.toDateString()} (invoice ${invoice.invoiceNumber}).`;

    let inApp = false;
    if (primaryGuardian?.userId) {
      await this.prisma.notification.create({
        data: {
          userId: primaryGuardian.userId,
          channel: 'IN_APP',
          title,
          body,
          relatedEntityType: 'Invoice',
          relatedEntityId: invoice.id,
        },
      });
      inApp = true;
    }

    const { sms, email } = await this.receipts.sendPaymentReminder(invoice.id);
    const channels = { inApp, sms, email };
    this.logger.log(`Payment reminder for invoice ${invoice.invoiceNumber}: ${JSON.stringify(channels)}`);
    return { delivered: inApp || sms || email, channels };
  }
}
