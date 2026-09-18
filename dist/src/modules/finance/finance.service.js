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
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
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
    constructor(prisma, playersService, receipts, tenantContext) {
        this.prisma = prisma;
        this.playersService = playersService;
        this.receipts = receipts;
        this.tenantContext = tenantContext;
        this.logger = new common_1.Logger(FinanceService_1.name);
    }
    findAllFeeItems(includeInactive = false) {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.feeItem.findMany({
            where: includeInactive ? { academyId } : { academyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    createFeeItem(dto) {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.feeItem.create({ data: { ...dto, academyId } });
    }
    async updateFeeItem(id, dto) {
        const academyId = this.tenantContext.getAcademyId();
        const feeItem = await this.prisma.feeItem.findFirst({ where: { id, academyId } });
        if (!feeItem) {
            throw new common_1.NotFoundException('Fee item not found');
        }
        return this.prisma.feeItem.update({ where: { id, academyId }, data: dto });
    }
    findAllFeeTypes(includeInactive = false) {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.feeType.findMany({
            where: includeInactive ? { academyId } : { academyId, isActive: true },
            include: FEE_TYPE_INCLUDE,
            orderBy: { name: 'asc' },
        });
    }
    async deactivateOtherRegistrationFeeTypes(excludeId) {
        const academyId = this.tenantContext.getAcademyId();
        await this.prisma.feeType.updateMany({
            where: {
                academyId,
                isRegistrationFee: true,
                isActive: true,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
            data: { isActive: false },
        });
    }
    async recomputeFeeTypeAmount(feeTypeId) {
        const academyId = this.tenantContext.getAcademyId();
        const links = await this.prisma.feeTypeItem.findMany({ where: { feeTypeId, academyId } });
        const total = links.reduce((sum, link) => sum + Number(link.amount), 0);
        await this.prisma.feeType.update({ where: { id: feeTypeId, academyId }, data: { defaultAmount: total } });
    }
    async createFeeType(dto) {
        const academyId = this.tenantContext.getAcademyId();
        if (dto.isRegistrationFee) {
            await this.deactivateOtherRegistrationFeeTypes();
        }
        return this.prisma.feeType.create({ data: { ...dto, academyId }, include: FEE_TYPE_INCLUDE });
    }
    async updateFeeType(id, dto) {
        const academyId = this.tenantContext.getAcademyId();
        const feeType = await this.prisma.feeType.findFirst({ where: { id, academyId } });
        if (!feeType) {
            throw new common_1.NotFoundException('Fee type not found');
        }
        const activating = dto.isActive === true && !feeType.isActive;
        if (activating && feeType.isRegistrationFee) {
            await this.deactivateOtherRegistrationFeeTypes(id);
        }
        return this.prisma.feeType.update({ where: { id, academyId }, data: dto, include: FEE_TYPE_INCLUDE });
    }
    async addFeeTypeItem(feeTypeId, feeItemId, amount) {
        const academyId = this.tenantContext.getAcademyId();
        const [feeType, feeItem] = await Promise.all([
            this.prisma.feeType.findFirst({ where: { id: feeTypeId, academyId } }),
            this.prisma.feeItem.findFirst({ where: { id: feeItemId, academyId } }),
        ]);
        if (!feeType)
            throw new common_1.NotFoundException('Fee not found');
        if (!feeItem)
            throw new common_1.NotFoundException('Fee item not found');
        await this.prisma.feeTypeItem.upsert({
            where: { feeTypeId_feeItemId: { feeTypeId, feeItemId }, academyId },
            create: { feeTypeId, feeItemId, amount, academyId },
            update: { amount },
        });
        await this.recomputeFeeTypeAmount(feeTypeId);
        return this.prisma.feeType.findFirstOrThrow({ where: { id: feeTypeId, academyId }, include: FEE_TYPE_INCLUDE });
    }
    async removeFeeTypeItem(feeTypeId, feeItemId) {
        const academyId = this.tenantContext.getAcademyId();
        await this.prisma.feeTypeItem.deleteMany({ where: { feeTypeId, feeItemId, academyId } });
        await this.recomputeFeeTypeAmount(feeTypeId);
        return this.prisma.feeType.findFirstOrThrow({ where: { id: feeTypeId, academyId }, include: FEE_TYPE_INCLUDE });
    }
    findInvoicesForPlayer(playerId) {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.invoice.findMany({
            where: { playerId, academyId, deletedAt: null },
            include: INVOICE_INCLUDE,
            orderBy: { issuedAt: 'desc' },
        });
    }
    async createInvoice(dto) {
        const academyId = this.tenantContext.getAcademyId();
        const feeType = await this.prisma.feeType.findFirst({ where: { id: dto.feeTypeId, academyId, isActive: true } });
        if (!feeType) {
            throw new common_1.BadRequestException('Fee type not found or inactive');
        }
        const player = await this.prisma.player.findFirst({ where: { id: dto.playerId, academyId, deletedAt: null } });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        return this.prisma.invoice.create({
            data: {
                invoiceNumber: (0, finance_utils_1.generateInvoiceNumber)(),
                academyId,
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
        const academyId = this.tenantContext.getAcademyId();
        const invoiceIds = dto.allocations.map((a) => a.invoiceId);
        const invoices = await this.prisma.invoice.findMany({
            where: { id: { in: invoiceIds }, playerId: dto.playerId, academyId, deletedAt: null },
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
                academyId,
                playerId: dto.playerId,
                amount: totalAmount,
                method: dto.method,
                reference: dto.reference,
                receivedByUserId,
                allocations: {
                    create: dto.allocations.map((a) => ({ invoiceId: a.invoiceId, amount: a.amount, academyId })),
                },
            },
            include: { allocations: true },
        });
        await this.prisma.$transaction(dto.allocations.map((allocation) => {
            const invoice = invoices.find((inv) => inv.id === allocation.invoiceId);
            const remainingAfter = (0, finance_utils_1.computeRemainingBalance)(invoice) - allocation.amount;
            const status = remainingAfter <= 0.01 ? 'PAID' : 'PARTIALLY_PAID';
            return this.prisma.invoice.update({ where: { id: invoice.id, academyId: invoice.academyId }, data: { status } });
        }));
        await this.playersService.activateAfterRegistrationPayment(dto.playerId);
        await this.receipts.sendPaymentReceipt(payment.id);
        return payment;
    }
    async getTeamStats() {
        const academyId = this.tenantContext.getAcademyId();
        const players = await this.prisma.player.findMany({
            where: { academyId, status: 'ACTIVE', deletedAt: null },
            select: { id: true, teamId: true, team: { select: { id: true, name: true } } },
        });
        const monthlyInvoices = players.length
            ? await this.prisma.invoice.findMany({
                where: {
                    academyId,
                    deletedAt: null,
                    feeType: { isRecurring: true },
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
        const academyId = this.tenantContext.getAcademyId();
        const invoices = await this.prisma.invoice.findMany({
            where: { academyId, deletedAt: null, status: { in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'] } },
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
        const academyId = this.tenantContext.getAcademyId();
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
                academyId,
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
        const academies = await this.prisma.academy.findMany({ where: { status: 'ACTIVE' } });
        for (const academy of academies) {
            await this.tenantContext.run({ academyId: academy.id, slug: academy.slug }, async () => {
                const result = await this.generateRecurringInvoices();
                this.logger.log(`Monthly billing cron (${academy.slug}): created ${result.created} invoice(s), skipped ${result.skipped} already-billed.`);
            });
        }
    }
    async generateRecurringInvoices() {
        const academyId = this.tenantContext.getAcademyId();
        const recurringFeeTypes = await this.prisma.feeType.findMany({
            where: { academyId, isRecurring: true, isActive: true },
        });
        if (recurringFeeTypes.length === 0) {
            return { created: 0, skipped: 0 };
        }
        const activePlayers = await this.prisma.player.findMany({
            where: { academyId, status: 'ACTIVE', deletedAt: null },
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
                        academyId,
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
                        academyId,
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
        const academyId = this.tenantContext.getAcademyId();
        const reference = month ? new Date(`${month}-01T00:00:00`) : new Date();
        const startOfMonth = new Date(reference.getFullYear(), reference.getMonth(), 1);
        const startOfNextMonth = new Date(reference.getFullYear(), reference.getMonth() + 1, 1);
        const monthKey = `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}`;
        const invoices = await this.prisma.invoice.findMany({
            where: {
                academyId,
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
        const academyId = this.tenantContext.getAcademyId();
        const invoice = await this.prisma.invoice.findFirst({
            where: { id: invoiceId, playerId, academyId, deletedAt: null },
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
                    academyId,
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
        receipts_service_1.ReceiptsService,
        tenant_context_service_1.TenantContextService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map