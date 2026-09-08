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
    constructor(prisma, guardianContext) {
        this.prisma = prisma;
        this.guardianContext = guardianContext;
    }
    async createOrder(userId, dto) {
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        await this.guardianContext.assertOwnsPlayer(guardianId, dto.playerId);
        return this.prisma.$transaction(async (tx) => {
            const { items, totalAmount } = await this.reserveItems(tx, dto.items);
            return tx.merchandiseOrder.create({
                data: {
                    guardianId,
                    submittedByUserId: userId,
                    playerId: dto.playerId,
                    totalAmount,
                    items: { create: items },
                },
                include: ORDER_INCLUDE,
            });
        });
    }
    async lookupPlayerByCode(playerCode) {
        const player = await this.prisma.player.findFirst({
            where: { playerCode, status: 'ACTIVE', deletedAt: null },
            select: { id: true, firstName: true, lastName: true, team: { select: { name: true } } },
        });
        if (!player) {
            throw new common_1.NotFoundException('No active player found with that code');
        }
        return player;
    }
    async createGuestOrder(dto) {
        const player = await this.prisma.player.findFirst({
            where: { playerCode: dto.playerCode, status: 'ACTIVE', deletedAt: null },
            select: { id: true },
        });
        if (!player) {
            throw new common_1.NotFoundException('No active player found with that code');
        }
        const playerGuardian = await this.prisma.playerGuardian.findFirst({
            where: { playerId: player.id },
            orderBy: { isPrimary: 'desc' },
            select: { guardianId: true },
        });
        if (!playerGuardian) {
            throw new common_1.BadRequestException('This player has no guardian on file — visit the academy to place this order');
        }
        return this.prisma.$transaction(async (tx) => {
            const { items, totalAmount } = await this.reserveItems(tx, dto.items);
            return tx.merchandiseOrder.create({
                data: {
                    guardianId: playerGuardian.guardianId,
                    playerId: player.id,
                    guestName: dto.guestName,
                    guestPhone: dto.guestPhone,
                    guestEmail: dto.guestEmail,
                    totalAmount,
                    items: { create: items },
                },
                include: ORDER_INCLUDE,
            });
        });
    }
    async reserveItems(tx, lines) {
        const items = [];
        for (const line of lines) {
            const variant = await tx.productVariant.findUnique({
                where: { id: line.productVariantId },
                include: { product: true },
            });
            if (!variant || !variant.isActive || !variant.product.isActive || variant.product.deletedAt) {
                throw new common_1.BadRequestException('One or more items are no longer available');
            }
            const result = await tx.productVariant.updateMany({
                where: { id: variant.id, stockQuantity: { gte: line.quantity } },
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
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        return this.prisma.merchandiseOrder.findMany({
            where: { guardianId },
            include: ORDER_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMine(userId, orderId) {
        const guardianId = await this.guardianContext.resolveGuardianId(userId);
        const order = await this.prisma.merchandiseOrder.findUnique({ where: { id: orderId }, include: ORDER_INCLUDE });
        if (!order || order.guardianId !== guardianId) {
            throw new common_1.ForbiddenException('This order does not belong to your account');
        }
        return order;
    }
    listAll(status) {
        return this.prisma.merchandiseOrder.findMany({
            where: status ? { status } : undefined,
            include: ORDER_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getForStaff(orderId) {
        const order = await this.prisma.merchandiseOrder.findUnique({ where: { id: orderId }, include: ORDER_INCLUDE });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    pendingCount() {
        return this.prisma.merchandiseOrder.count({ where: { status: 'PENDING' } });
    }
    async updateStatus(orderId, status, staffNotes) {
        const order = await this.prisma.merchandiseOrder.findUnique({
            where: { id: orderId },
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
                        invoiceNumber: (0, finance_utils_1.generateInvoiceNumber)(),
                        playerId: order.playerId,
                        feeTypeId: MERCHANDISE_FEE_TYPE_ID,
                        description: describeOrderItems(order.items),
                        amount: order.totalAmount,
                        dueDate: new Date(Date.now() + INVOICE_DUE_DAYS * 24 * 60 * 60 * 1000),
                        status: 'PENDING',
                    },
                });
                await tx.merchandiseOrder.update({
                    where: { id: orderId },
                    data: { status, invoiceId: invoice.id, staffNotes },
                });
                return;
            }
            if (status === 'REJECTED' || status === 'CANCELLED') {
                if (order.invoice && (order.invoice.status === 'PAID' || order.invoice.status === 'PARTIALLY_PAID')) {
                    throw new common_1.ConflictException('Payment has already been recorded for this order — void it first');
                }
                await this.restoreStock(tx, order.items);
                if (order.invoiceId) {
                    await tx.invoice.update({ where: { id: order.invoiceId }, data: { status: 'CANCELLED' } });
                }
                await tx.merchandiseOrder.update({ where: { id: orderId }, data: { status, staffNotes } });
                return;
            }
            await tx.merchandiseOrder.update({ where: { id: orderId }, data: { status, staffNotes } });
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
    async restoreStock(tx, items) {
        for (const item of items) {
            await tx.productVariant.updateMany({
                where: { id: item.productVariantId },
                data: { stockQuantity: { increment: item.quantity } },
            });
        }
    }
};
exports.MerchandiseOrdersService = MerchandiseOrdersService;
exports.MerchandiseOrdersService = MerchandiseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        guardian_context_service_1.GuardianContextService])
], MerchandiseOrdersService);
//# sourceMappingURL=merchandise-orders.service.js.map