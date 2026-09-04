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
var FinanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const players_service_1 = require("../players/players.service");
const receipts_service_1 = require("../receipts/receipts.service");
const finance_utils_1 = require("./finance.utils");
const FEE_TYPE_INCLUDE = {
    items: { include: { feeItem: true } },
};
const INVOICE_INCLUDE = {
    feeType: { include: FEE_TYPE_INCLUDE },
    allocations: true,
};
let FinanceService = FinanceService_1 = class FinanceService {
    constructor(prisma, playersService, receipts) {
        this.prisma = prisma;
        this.playersService = playersService;
        this.receipts = receipts;
        this.logger = new common_1.Logger(FinanceService_1.name);
    }
    findAllFeeItems(includeInactive = false) {
        return this.prisma.feeItem.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    createFeeItem(dto) {
        return this.prisma.feeItem.create({ data: dto });
    }
    async updateFeeItem(id, dto) {
        const feeItem = await this.prisma.feeItem.findUnique({ where: { id } });
        if (!feeItem) {
            throw new common_1.NotFoundException('Fee item not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.feeItem.update({ where: { id }, data: dto });
            if (dto.defaultAmount !== undefined) {
                const links = await tx.feeTypeItem.findMany({ where: { feeItemId: id }, select: { feeTypeId: true } });
                for (const link of links) {
                    await this.recomputeFeeTypeAmount(tx, link.feeTypeId);
                }
            }
            return updated;
        });
    }
    findAllFeeTypes(includeInactive = false) {
        return this.prisma.feeType.findMany({
            where: includeInactive ? {} : { isActive: true },
            include: FEE_TYPE_INCLUDE,
            orderBy: { name: 'asc' },
        });
    }
    async deactivateOtherRegistrationFeeTypes(tx, excludeId) {
        await tx.feeType.updateMany({
            where: { category: 'REGISTRATION', isActive: true, ...(excludeId ? { id: { not: excludeId } } : {}) },
            data: { isActive: false },
        });
    }
    async recomputeFeeTypeAmount(tx, feeTypeId) {
        const items = await tx.feeTypeItem.findMany({ where: { feeTypeId }, include: { feeItem: true } });
        const total = items.reduce((sum, link) => sum + Number(link.feeItem.defaultAmount), 0);
        await tx.feeType.update({ where: { id: feeTypeId }, data: { defaultAmount: total } });
    }
    async createFeeType(dto) {
        if (dto.category === 'REGISTRATION') {
            return this.prisma.$transaction(async (tx) => {
                await this.deactivateOtherRegistrationFeeTypes(tx);
                return tx.feeType.create({ data: dto, include: FEE_TYPE_INCLUDE });
            });
        }
        return this.prisma.feeType.create({ data: dto, include: FEE_TYPE_INCLUDE });
    }
    async updateFeeType(id, dto) {
        const feeType = await this.prisma.feeType.findUnique({ where: { id } });
        if (!feeType) {
            throw new common_1.NotFoundException('Fee type not found');
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
    async addFeeTypeItem(feeTypeId, feeItemId) {
        const [feeType, feeItem] = await Promise.all([
            this.prisma.feeType.findUnique({ where: { id: feeTypeId } }),
            this.prisma.feeItem.findUnique({ where: { id: feeItemId } }),
        ]);
        if (!feeType)
            throw new common_1.NotFoundException('Fee not found');
        if (!feeItem)
            throw new common_1.NotFoundException('Fee item not found');
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
    async removeFeeTypeItem(feeTypeId, feeItemId) {
        return this.prisma.$transaction(async (tx) => {
            await tx.feeTypeItem.deleteMany({ where: { feeTypeId, feeItemId } });
            await this.recomputeFeeTypeAmount(tx, feeTypeId);
            return tx.feeType.findUniqueOrThrow({ where: { id: feeTypeId }, include: FEE_TYPE_INCLUDE });
        });
    }
    findInvoicesForPlayer(playerId) {
        return this.prisma.invoice.findMany({
            where: { playerId, deletedAt: null },
            include: INVOICE_INCLUDE,
            orderBy: { issuedAt: 'desc' },
        });
    }
    async createInvoice(dto) {
        const feeType = await this.prisma.feeType.findFirst({ where: { id: dto.feeTypeId, isActive: true } });
        if (!feeType) {
            throw new common_1.BadRequestException('Fee type not found or inactive');
        }
        const player = await this.prisma.player.findFirst({ where: { id: dto.playerId, deletedAt: null } });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        return this.prisma.invoice.create({
            data: {
                invoiceNumber: (0, finance_utils_1.generateInvoiceNumber)(),
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
    async createPayment(dto, receivedByUserId) {
        const invoiceIds = dto.allocations.map((a) => a.invoiceId);
        const invoices = await this.prisma.invoice.findMany({
            where: { id: { in: invoiceIds }, playerId: dto.playerId, deletedAt: null },
            include: INVOICE_INCLUDE,
        });
        if (invoices.length !== new Set(invoiceIds).size) {
            throw new common_1.BadRequestException('One or more invoices were not found for this player');
        }
        for (const allocation of dto.allocations) {
            const invoice = invoices.find((inv) => inv.id === allocation.invoiceId);
            const remaining = (0, finance_utils_1.computeRemainingBalance)(invoice);
            if (allocation.amount > remaining + 0.01) {
                throw new common_1.BadRequestException(`Allocation of ${allocation.amount} exceeds the remaining balance of ${remaining.toFixed(2)} on invoice ${invoice.invoiceNumber}`);
            }
        }
        const totalAmount = dto.allocations.reduce((sum, a) => sum + a.amount, 0);
        const payment = await this.prisma.payment.create({
            data: {
                receiptNumber: (0, finance_utils_1.generateReceiptNumber)(),
                playerId: dto.playerId,
                amount: totalAmount,
                method: dto.method,
                reference: dto.reference,
                receivedByUserId,
                allocations: { create: dto.allocations.map((a) => ({ invoiceId: a.invoiceId, amount: a.amount })) },
            },
            include: { allocations: true },
        });
        await this.prisma.$transaction(dto.allocations.map((allocation) => {
            const invoice = invoices.find((inv) => inv.id === allocation.invoiceId);
            const remainingAfter = (0, finance_utils_1.computeRemainingBalance)(invoice) - allocation.amount;
            const status = remainingAfter <= 0.01 ? 'PAID' : 'PARTIALLY_PAID';
            return this.prisma.invoice.update({ where: { id: invoice.id }, data: { status } });
        }));
        await this.playersService.activateAfterRegistrationPayment(dto.playerId);
        await this.receipts.sendPaymentReceipt(payment.id);
        return payment;
    }
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
        const owingByPlayer = new Set();
        for (const invoice of monthlyInvoices) {
            if ((0, finance_utils_1.computeRemainingBalance)(invoice) > 0.01)
                owingByPlayer.add(invoice.playerId);
        }
        const buckets = new Map();
        for (const player of players) {
            const key = player.teamId ?? 'unassigned';
            const bucket = buckets.get(key) ?? {
                teamId: player.teamId,
                teamName: player.team?.name ?? 'No team assigned',
                activePlayers: 0,
                owingMonthlySubscription: 0,
            };
            bucket.activePlayers += 1;
            if (owingByPlayer.has(player.id))
                bucket.owingMonthlySubscription += 1;
            buckets.set(key, bucket);
        }
        const teams = Array.from(buckets.values())
            .map((b) => ({ ...b, paidUpToDate: b.activePlayers - b.owingMonthlySubscription }))
            .sort((a, b) => b.activePlayers - a.activePlayers);
        const totals = teams.reduce((acc, t) => ({
            activePlayers: acc.activePlayers + t.activePlayers,
            owingMonthlySubscription: acc.owingMonthlySubscription + t.owingMonthlySubscription,
            paidUpToDate: acc.paidUpToDate + t.paidUpToDate,
        }), { activePlayers: 0, owingMonthlySubscription: 0, paidUpToDate: 0 });
        return { teams, totals };
    }
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
        const byPlayer = new Map();
        for (const invoice of invoices) {
            const remaining = (0, finance_utils_1.computeRemainingBalance)(invoice);
            if (remaining <= 0.01)
                continue;
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
    async getDebtorsAging(minMonths = 0) {
        const debtors = await this.listDebtors();
        const now = new Date();
        return debtors
            .map((row) => {
            const oldestDueDate = row.invoices[0].dueDate;
            return { ...row, oldestDueDate, monthsOwing: (0, finance_utils_1.monthsBetween)(oldestDueDate, now) };
        })
            .filter((row) => row.monthsOwing >= minMonths)
            .sort((a, b) => b.monthsOwing - a.monthsOwing || b.totalOwed - a.totalOwed);
    }
    async getPaymentsReport(from, to, feeTypeId, playerId) {
        const paidAt = {};
        if (from)
            paidAt.gte = new Date(from);
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
        const rows = allocations.map((a) => ({
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
        const byFeeTypeMap = new Map();
        const byMethodMap = new Map();
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
    async handleMonthlyBillingCron() {
        const result = await this.generateRecurringInvoices();
        this.logger.log(`Monthly billing cron: created ${result.created} invoice(s), skipped ${result.skipped} already-billed.`);
    }
    async generateRecurringInvoices() {
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
                        invoiceNumber: (0, finance_utils_1.generateInvoiceNumber)(),
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
    async getMonthlyBilling(month) {
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
        const rows = invoices.map((invoice) => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            player: invoice.player,
            feeTypeId: invoice.feeType.id,
            feeTypeName: invoice.feeType.name,
            amount: Number(invoice.amount),
            remaining: (0, finance_utils_1.computeRemainingBalance)(invoice),
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
    async sendPaymentReminder(playerId, invoiceId) {
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
            throw new common_1.NotFoundException('Invoice not found for this player');
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
};
exports.FinanceService = FinanceService;
__decorate([
    (0, schedule_1.Cron)('0 0 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanceService.prototype, "handleMonthlyBillingCron", null);
exports.FinanceService = FinanceService = FinanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        players_service_1.PlayersService,
        receipts_service_1.ReceiptsService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map