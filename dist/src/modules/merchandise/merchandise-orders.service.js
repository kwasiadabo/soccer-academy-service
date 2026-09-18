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
exports.MerchandiseOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_context_service_1 = require("../../common/tenant-context/tenant-context.service");
const guardian_context_service_1 = require("../guardians/guardian-context.service");
const finance_utils_1 = require("../finance/finance.utils");
const MERCHANDISE_FEE_TYPE_ID = '00000000-0000-4000-8000-000000000004';
const INVOICE_DUE_DAYS = 7;
const PERSON_SELECT = { id: true, firstName: true, lastName: true };
const ORDER_INCLUDE = {
    guardian: { select: PERSON_SELECT },
    submittedBy: { select: PERSON_SELECT },
    player: { select: { id: true, firstName: true, lastName: true, playerCode: true } },
    invoice: {
        select: {
            id: true,
            invoiceNumber: true,
            status: true,
            amount: true,
            discountAmount: true,
            description: true,
            dueDate: true,
            allocations: { select: { amount: true } },
        },
    },
    items: {
        include: {
            productVariant: { include: { product: { include: { images: { orderBy: { sortOrder: 'asc' } } } } } },
        },
    },
};
function describeOrderItems(items) {
    return items.map((i) => `${i.productVariant.product.name} (${i.productVariant.sizeLabel}) ×${i.quantity}`).join(', ');
}
let MerchandiseOrdersService = class MerchandiseOrdersService {
    constructor(prisma, guardianContext, tenantContext) {
        this.prisma = prisma;
        this.guardianContext = guardianContext;
        this.tenantContext = tenantContext;
    }
    async createOrder(userId, dto) {
        const academyId = this.tenantContext.getAcademyId();
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        await this.guardianContext.assertOwnsPlayer(guardianId, dto.playerId);
        return this.prisma.$transaction(async (tx) => {
            const { items, totalAmount } = await this.reserveItems(tx, academyId, dto.items);
            return tx.merchandiseOrder.create({
                data: {
                    academyId,
                    guardianId,
                    submittedByUserId: userId,
                    playerId: dto.playerId,
                    totalAmount,
                    items: { create: items.map((item) => ({ ...item, academyId })) },
                },
                include: ORDER_INCLUDE,
            });
        });
    }
    async lookupPlayerByCode(playerCode) {
        const academyId = this.tenantContext.getAcademyId();
        const player = await this.prisma.player.findFirst({
            where: { academyId, playerCode, status: 'ACTIVE', deletedAt: null },
            select: { id: true, firstName: true, lastName: true, team: { select: { name: true } } },
        });
        if (!player) {
            throw new common_1.NotFoundException('No active player found with that code');
        }
        return player;
    }
    async createGuestOrder(dto) {
        const academyId = this.tenantContext.getAcademyId();
        const player = await this.prisma.player.findFirst({
            where: { academyId, playerCode: dto.playerCode, status: 'ACTIVE', deletedAt: null },
            select: { id: true },
        });
        if (!player) {
            throw new common_1.NotFoundException('No active player found with that code');
        }
        const playerGuardian = await this.prisma.playerGuardian.findFirst({
            where: { academyId, playerId: player.id },
            orderBy: { isPrimary: 'desc' },
            select: { guardianId: true },
        });
        if (!playerGuardian) {
            throw new common_1.BadRequestException('This player has no guardian on file — visit the academy to place this order');
        }
        return this.prisma.$transaction(async (tx) => {
            const { items, totalAmount } = await this.reserveItems(tx, academyId, dto.items);
            return tx.merchandiseOrder.create({
                data: {
                    academyId,
                    guardianId: playerGuardian.guardianId,
                    playerId: player.id,
                    guestName: dto.guestName,
                    guestPhone: dto.guestPhone,
                    guestEmail: dto.guestEmail,
                    totalAmount,
                    items: { create: items.map((item) => ({ ...item, academyId })) },
                },
                include: ORDER_INCLUDE,
            });
        });
    }
    async reserveItems(tx, academyId, lines) {
        const items = [];
        for (const line of lines) {
            const variant = await tx.productVariant.findFirst({
                where: { id: line.productVariantId, academyId },
                include: { product: true },
            });
            if (!variant || !variant.isActive || !variant.product.isActive || variant.product.deletedAt) {
                throw new common_1.BadRequestException('One or more items are no longer available');
            }
            const result = await tx.productVariant.updateMany({
                where: { id: variant.id, academyId, stockQuantity: { gte: line.quantity } },
                data: { stockQuantity: { decrement: line.quantity } },
            });
            if (result.count === 0) {
                throw new common_1.ConflictException(`Not enough stock for ${variant.product.name} (${variant.sizeLabel})`);
            }
            const unitPrice = Number(variant.priceOverride ?? variant.product.basePrice);
            items.push({
                productVariantId: variant.id,
                quantity: line.quantity,
                unitPriceAtOrder: unitPrice,
                lineTotal: unitPrice * line.quantity,
            });
        }
        const totalAmount = items.reduce((sum, i) => sum + i.lineTotal, 0);
        return { items, totalAmount };
    }
    async listMine(userId) {
        const academyId = this.tenantContext.getAcademyId();
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        return this.prisma.merchandiseOrder.findMany({
            where: { academyId, guardianId },
            include: ORDER_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMine(userId, orderId) {
        const academyId = this.tenantContext.getAcademyId();
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        const order = await this.prisma.merchandiseOrder.findFirst({ where: { id: orderId, academyId }, include: ORDER_INCLUDE });
        if (!order || order.guardianId !== guardianId) {
            throw new common_1.ForbiddenException('This order does not belong to your account');
        }
        return order;
    }
    listAll(status) {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.merchandiseOrder.findMany({
            where: { academyId, ...(status ? { status } : {}) },
            include: ORDER_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getForStaff(orderId) {
        const academyId = this.tenantContext.getAcademyId();
        const order = await this.prisma.merchandiseOrder.findFirst({ where: { id: orderId, academyId }, include: ORDER_INCLUDE });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    pendingCount() {
        const academyId = this.tenantContext.getAcademyId();
        return this.prisma.merchandiseOrder.count({ where: { academyId, status: 'PENDING' } });
    }
    async getOrdersReport(from, to, status = 'SOLD') {
        const rows = status === 'SOLD' ? await this.getSoldOrderRows(from, to) : await this.getPendingOrderRows(from, to);
        rows.sort((a, b) => b.date.getTime() - a.date.getTime());
        const byProductMap = new Map();
        const orderIds = new Set();
        let totalAmount = 0;
        let itemCount = 0;
        for (const row of rows) {
            totalAmount += row.lineTotal;
            itemCount += row.quantity;
            orderIds.add(row.orderId);
            const productEntry = byProductMap.get(row.productName) ?? { productName: row.productName, quantity: 0, total: 0 };
            productEntry.quantity += row.quantity;
            productEntry.total += row.lineTotal;
            byProductMap.set(row.productName, productEntry);
        }
        return {
            rows,
            summary: {
                totalAmount,
                itemCount,
                orderCount: orderIds.size,
                byProduct: Array.from(byProductMap.values()).sort((a, b) => b.total - a.total),
            },
        };
    }
    buildDateFilter(from, to) {
        if (!from && !to)
            return undefined;
        const filter = {};
        if (from)
            filter.gte = new Date(from);
        if (to) {
            const end = new Date(to);
            end.setHours(23, 59, 59, 999);
            filter.lte = end;
        }
        return filter;
    }
    async getSoldOrderRows(from, to) {
        const academyId = this.tenantContext.getAcademyId();
        const paidAt = this.buildDateFilter(from, to);
        const orders = await this.prisma.merchandiseOrder.findMany({
            where: {
                academyId,
                invoice: {
                    status: 'PAID',
                    allocations: { some: { payment: { status: 'COMPLETED', ...(paidAt ? { paidAt } : {}) } } },
                },
            },
            include: {
                player: { select: { id: true, firstName: true, lastName: true, playerCode: true } },
                invoice: {
                    select: {
                        invoiceNumber: true,
                        allocations: {
                            where: { payment: { status: 'COMPLETED' } },
                            select: { payment: { select: { paidAt: true } } },
                        },
                    },
                },
                items: { include: { productVariant: { include: { product: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
        const rows = [];
        for (const order of orders) {
            if (!order.invoice)
                continue;
            const date = new Date(Math.max(...order.invoice.allocations.map((a) => a.payment.paidAt.getTime())));
            for (const item of order.items) {
                rows.push({
                    orderId: order.id,
                    invoiceNumber: order.invoice.invoiceNumber,
                    date,
                    status: 'SOLD',
                    player: order.player,
                    productName: item.productVariant.product.name,
                    category: item.productVariant.product.category,
                    sizeLabel: item.productVariant.sizeLabel,
                    quantity: item.quantity,
                    unitPriceAtOrder: Number(item.unitPriceAtOrder),
                    lineTotal: Number(item.lineTotal),
                });
            }
        }
        return rows;
    }
    async getPendingOrderRows(from, to) {
        const academyId = this.tenantContext.getAcademyId();
        const createdAt = this.buildDateFilter(from, to);
        const orders = await this.prisma.merchandiseOrder.findMany({
            where: {
                academyId,
                status: { notIn: ['REJECTED', 'CANCELLED'] },
                OR: [{ invoiceId: null }, { invoice: { status: { not: 'PAID' } } }],
                ...(createdAt ? { createdAt } : {}),
            },
            include: {
                player: { select: { id: true, firstName: true, lastName: true, playerCode: true } },
                invoice: { select: { invoiceNumber: true } },
                items: { include: { productVariant: { include: { product: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
        const rows = [];
        for (const order of orders) {
            for (const item of order.items) {
                rows.push({
                    orderId: order.id,
                    invoiceNumber: order.invoice?.invoiceNumber ?? null,
                    date: order.createdAt,
                    status: 'PENDING',
                    player: order.player,
                    productName: item.productVariant.product.name,
                    category: item.productVariant.product.category,
                    sizeLabel: item.productVariant.sizeLabel,
                    quantity: item.quantity,
                    unitPriceAtOrder: Number(item.unitPriceAtOrder),
                    lineTotal: Number(item.lineTotal),
                });
            }
        }
        return rows;
    }
    async updateStatus(orderId, status, staffNotes) {
        const academyId = this.tenantContext.getAcademyId();
        const order = await this.prisma.merchandiseOrder.findFirst({
            where: { id: orderId, academyId },
            include: {
                items: { include: { productVariant: { include: { product: true } } } },
                invoice: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        this.assertTransitionAllowed(order.status, status);
        await this.prisma.$transaction(async (tx) => {
            if (status === 'APPROVED') {
                const invoice = await tx.invoice.create({
                    data: {
                        academyId,
                        invoiceNumber: (0, finance_utils_1.generateInvoiceNumber)(),
                        playerId: order.playerId,
                        feeTypeId: MERCHANDISE_FEE_TYPE_ID,
                        description: describeOrderItems(order.items),
                        amount: order.totalAmount,
                        dueDate: new Date(Date.now() + INVOICE_DUE_DAYS * 24 * 60 * 60 * 1000),
                        status: 'PENDING',
                    },
                });
                await tx.merchandiseOrder.updateMany({
                    where: { id: orderId, academyId },
                    data: { status, invoiceId: invoice.id, staffNotes },
                });
                return;
            }
            if (status === 'REJECTED' || status === 'CANCELLED') {
                if (order.invoice && (order.invoice.status === 'PAID' || order.invoice.status === 'PARTIALLY_PAID')) {
                    throw new common_1.ConflictException('Payment has already been recorded for this order — void it first');
                }
                await this.restoreStock(tx, academyId, order.items);
                if (order.invoiceId) {
                    await tx.invoice.update({ where: { id: order.invoiceId }, data: { status: 'CANCELLED' } });
                }
                await tx.merchandiseOrder.updateMany({ where: { id: orderId, academyId }, data: { status, staffNotes } });
                return;
            }
            await tx.merchandiseOrder.updateMany({ where: { id: orderId, academyId }, data: { status, staffNotes } });
        });
        return this.getForStaff(orderId);
    }
    assertTransitionAllowed(from, to) {
        const allowed = {
            PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
            APPROVED: ['READY_FOR_PICKUP', 'CANCELLED'],
            READY_FOR_PICKUP: ['FULFILLED'],
            FULFILLED: [],
            REJECTED: [],
            CANCELLED: [],
        };
        if (!allowed[from].includes(to)) {
            throw new common_1.BadRequestException(`Cannot move an order from ${from} to ${to}`);
        }
    }
    async restoreStock(tx, academyId, items) {
        for (const item of items) {
            await tx.productVariant.updateMany({
                where: { id: item.productVariantId, academyId },
                data: { stockQuantity: { increment: item.quantity } },
            });
        }
    }
};
exports.MerchandiseOrdersService = MerchandiseOrdersService;
exports.MerchandiseOrdersService = MerchandiseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        guardian_context_service_1.GuardianContextService,
        tenant_context_service_1.TenantContextService])
], MerchandiseOrdersService);
//# sourceMappingURL=merchandise-orders.service.js.map