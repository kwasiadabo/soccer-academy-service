import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MerchandiseOrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { generateInvoiceNumber } from '../finance/finance.utils';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';

const MERCHANDISE_FEE_TYPE_ID = '00000000-0000-4000-8000-000000000004';
const INVOICE_DUE_DAYS = 7;

const PERSON_SELECT = { id: true, firstName: true, lastName: true } as const;

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
} as const;

function describeOrderItems(items: { quantity: number; productVariant: { sizeLabel: string; product: { name: string } } }[]): string {
  return items.map((i) => `${i.productVariant.product.name} (${i.productVariant.sizeLabel}) ×${i.quantity}`).join(', ');
}

@Injectable()
export class MerchandiseOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly guardianContext: GuardianContextService,
  ) {}

  // --- Parent-facing ---

  async createOrder(userId: string, dto: CreateOrderDto) {
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

  // --- Public storefront (guest checkout, no login required) ---

  // Deliberately narrow: only enough to confirm the code matches a real, active
  // player before checkout — never returns a listable roster.
  async lookupPlayerByCode(playerCode: string) {
    const player = await this.prisma.player.findFirst({
      where: { playerCode, status: 'ACTIVE', deletedAt: null },
      select: { id: true, firstName: true, lastName: true, team: { select: { name: true } } },
    });
    if (!player) {
      throw new NotFoundException('No active player found with that code');
    }
    return player;
  }

  async createGuestOrder(dto: CreateGuestOrderDto) {
    const player = await this.prisma.player.findFirst({
      where: { playerCode: dto.playerCode, status: 'ACTIVE', deletedAt: null },
      select: { id: true },
    });
    if (!player) {
      throw new NotFoundException('No active player found with that code');
    }

    // Every registered player has at least one guardian (enforced at registration) —
    // prefer the primary one so the order lands with whoever the family designated.
    const playerGuardian = await this.prisma.playerGuardian.findFirst({
      where: { playerId: player.id },
      orderBy: { isPrimary: 'desc' },
      select: { guardianId: true },
    });
    if (!playerGuardian) {
      throw new BadRequestException('This player has no guardian on file — visit the academy to place this order');
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

  private async reserveItems(
    tx: Prisma.TransactionClient,
    lines: { productVariantId: string; quantity: number }[],
  ): Promise<{
    items: { productVariantId: string; quantity: number; unitPriceAtOrder: number; lineTotal: number }[];
    totalAmount: number;
  }> {
    const items: { productVariantId: string; quantity: number; unitPriceAtOrder: number; lineTotal: number }[] = [];

    for (const line of lines) {
      const variant = await tx.productVariant.findUnique({
        where: { id: line.productVariantId },
        include: { product: true },
      });
      if (!variant || !variant.isActive || !variant.product.isActive || variant.product.deletedAt) {
        throw new BadRequestException('One or more items are no longer available');
      }

      const result = await tx.productVariant.updateMany({
        where: { id: variant.id, stockQuantity: { gte: line.quantity } },
        data: { stockQuantity: { decrement: line.quantity } },
      });
      if (result.count === 0) {
        throw new ConflictException(`Not enough stock for ${variant.product.name} (${variant.sizeLabel})`);
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

  async listMine(userId: string) {
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    return this.prisma.merchandiseOrder.findMany({
      where: { guardianId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMine(userId: string, orderId: string) {
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    const order = await this.prisma.merchandiseOrder.findUnique({ where: { id: orderId }, include: ORDER_INCLUDE });
    if (!order || order.guardianId !== guardianId) {
      throw new ForbiddenException('This order does not belong to your account');
    }
    return order;
  }

  // --- Staff-facing ---

  listAll(status?: MerchandiseOrderStatus) {
    return this.prisma.merchandiseOrder.findMany({
      where: status ? { status } : undefined,
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getForStaff(orderId: string) {
    const order = await this.prisma.merchandiseOrder.findUnique({ where: { id: orderId }, include: ORDER_INCLUDE });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  pendingCount() {
    return this.prisma.merchandiseOrder.count({ where: { status: 'PENDING' } });
  }

  async updateStatus(orderId: string, status: MerchandiseOrderStatus, staffNotes?: string) {
    const order = await this.prisma.merchandiseOrder.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { productVariant: { include: { product: true } } } },
        invoice: true,
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    this.assertTransitionAllowed(order.status, status);

    await this.prisma.$transaction(async (tx) => {
      if (status === 'APPROVED') {
        const invoice = await tx.invoice.create({
          data: {
            invoiceNumber: generateInvoiceNumber(),
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
          throw new ConflictException('Payment has already been recorded for this order — void it first');
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

  private assertTransitionAllowed(from: MerchandiseOrderStatus, to: MerchandiseOrderStatus) {
    const allowed: Record<MerchandiseOrderStatus, MerchandiseOrderStatus[]> = {
      PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
      APPROVED: ['READY_FOR_PICKUP', 'CANCELLED'],
      READY_FOR_PICKUP: ['FULFILLED'],
      FULFILLED: [],
      REJECTED: [],
      CANCELLED: [],
    };
    if (!allowed[from].includes(to)) {
      throw new BadRequestException(`Cannot move an order from ${from} to ${to}`);
    }
  }

  private async restoreStock(
    tx: Prisma.TransactionClient,
    items: { productVariantId: string; quantity: number }[],
  ) {
    for (const item of items) {
      await tx.productVariant.updateMany({
        where: { id: item.productVariantId },
        data: { stockQuantity: { increment: item.quantity } },
      });
    }
  }
}
