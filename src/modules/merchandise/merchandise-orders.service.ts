import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MerchandiseOrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { GuardianContextService } from '../guardians/guardian-context.service';
import { generateInvoiceNumber } from '../finance/finance.utils';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';

const MERCHANDISE_FEE_TYPE_ID = '00000000-0000-4000-8000-000000000004';
const INVOICE_DUE_DAYS = 7;

export type OrdersReportStatus = 'SOLD' | 'PENDING';

export interface OrdersReportRow {
  orderId: string;
  invoiceNumber: string | null;
  date: Date;
  status: OrdersReportStatus;
  player: { id: string; firstName: string; lastName: string; playerCode: string | null };
  productName: string;
  category: string;
  sizeLabel: string;
  quantity: number;
  unitPriceAtOrder: number;
  lineTotal: number;
}

export interface OrdersReport {
  rows: OrdersReportRow[];
  summary: {
    totalAmount: number;
    itemCount: number;
    orderCount: number;
    byProduct: { productName: string; quantity: number; total: number }[];
  };
}

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
    private readonly tenantContext: TenantContextService,
  ) {}

  // --- Parent-facing ---

  async createOrder(userId: string, dto: CreateOrderDto) {
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

  // --- Public storefront (guest checkout, no login required) ---

  // Deliberately narrow: only enough to confirm the code matches a real, active
  // player before checkout — never returns a listable roster.
  async lookupPlayerByCode(playerCode: string) {
    const academyId = this.tenantContext.getAcademyId();
    const player = await this.prisma.player.findFirst({
      where: { academyId, playerCode, status: 'ACTIVE', deletedAt: null },
      select: { id: true, firstName: true, lastName: true, team: { select: { name: true } } },
    });
    if (!player) {
      throw new NotFoundException('No active player found with that code');
    }
    return player;
  }

  async createGuestOrder(dto: CreateGuestOrderDto) {
    const academyId = this.tenantContext.getAcademyId();
    const player = await this.prisma.player.findFirst({
      where: { academyId, playerCode: dto.playerCode, status: 'ACTIVE', deletedAt: null },
      select: { id: true },
    });
    if (!player) {
      throw new NotFoundException('No active player found with that code');
    }

    // Every registered player has at least one guardian (enforced at registration) —
    // prefer the primary one so the order lands with whoever the family designated.
    const playerGuardian = await this.prisma.playerGuardian.findFirst({
      where: { academyId, playerId: player.id },
      orderBy: { isPrimary: 'desc' },
      select: { guardianId: true },
    });
    if (!playerGuardian) {
      throw new BadRequestException('This player has no guardian on file — visit the academy to place this order');
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

  private async reserveItems(
    tx: Prisma.TransactionClient,
    academyId: string,
    lines: { productVariantId: string; quantity: number }[],
  ): Promise<{
    items: { productVariantId: string; quantity: number; unitPriceAtOrder: number; lineTotal: number }[];
    totalAmount: number;
  }> {
    const items: { productVariantId: string; quantity: number; unitPriceAtOrder: number; lineTotal: number }[] = [];

    for (const line of lines) {
      const variant = await tx.productVariant.findFirst({
        where: { id: line.productVariantId, academyId },
        include: { product: true },
      });
      if (!variant || !variant.isActive || !variant.product.isActive || variant.product.deletedAt) {
        throw new BadRequestException('One or more items are no longer available');
      }

      const result = await tx.productVariant.updateMany({
        where: { id: variant.id, academyId, stockQuantity: { gte: line.quantity } },
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
    const academyId = this.tenantContext.getAcademyId();
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    return this.prisma.merchandiseOrder.findMany({
      where: { academyId, guardianId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMine(userId: string, orderId: string) {
    const academyId = this.tenantContext.getAcademyId();
    const guardianId = await this.guardianContext.resolveGuardianId(userId);
    const order = await this.prisma.merchandiseOrder.findFirst({ where: { id: orderId, academyId }, include: ORDER_INCLUDE });
    if (!order || order.guardianId !== guardianId) {
      throw new ForbiddenException('This order does not belong to your account');
    }
    return order;
  }

  // --- Staff-facing ---

  listAll(status?: MerchandiseOrderStatus) {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.merchandiseOrder.findMany({
      where: { academyId, ...(status ? { status } : {}) },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getForStaff(orderId: string) {
    const academyId = this.tenantContext.getAcademyId();
    const order = await this.prisma.merchandiseOrder.findFirst({ where: { id: orderId, academyId }, include: ORDER_INCLUDE });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  pendingCount() {
    const academyId = this.tenantContext.getAcademyId();
    return this.prisma.merchandiseOrder.count({ where: { academyId, status: 'PENDING' } });
  }

  // --- Orders report: items ordered within a date range, either already paid for ("sold")
  // or still awaiting payment ("pending") ---
  async getOrdersReport(from?: string, to?: string, status: OrdersReportStatus = 'SOLD'): Promise<OrdersReport> {
    const rows = status === 'SOLD' ? await this.getSoldOrderRows(from, to) : await this.getPendingOrderRows(from, to);
    rows.sort((a, b) => b.date.getTime() - a.date.getTime());

    const byProductMap = new Map<string, { productName: string; quantity: number; total: number }>();
    const orderIds = new Set<string>();
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

  private buildDateFilter(from?: string, to?: string): Prisma.DateTimeFilter | undefined {
    if (!from && !to) return undefined;
    const filter: Prisma.DateTimeFilter = {};
    if (from) filter.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      filter.lte = end;
    }
    return filter;
  }

  // Sold = invoice fully paid; the report date is when the last payment settling it landed.
  private async getSoldOrderRows(from?: string, to?: string): Promise<OrdersReportRow[]> {
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

    const rows: OrdersReportRow[] = [];
    for (const order of orders) {
      if (!order.invoice) continue;
      // An invoice can settle across several payments — use the latest as "when this order was paid off".
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

  // Pending = not yet fully paid (and not rejected/cancelled); the report date is when the order was placed.
  private async getPendingOrderRows(from?: string, to?: string): Promise<OrdersReportRow[]> {
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

    const rows: OrdersReportRow[] = [];
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

  async updateStatus(orderId: string, status: MerchandiseOrderStatus, staffNotes?: string) {
    const academyId = this.tenantContext.getAcademyId();
    const order = await this.prisma.merchandiseOrder.findFirst({
      where: { id: orderId, academyId },
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
            academyId,
            invoiceNumber: generateInvoiceNumber(),
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
          throw new ConflictException('Payment has already been recorded for this order — void it first');
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
    academyId: string,
    items: { productVariantId: string; quantity: number }[],
  ) {
    for (const item of items) {
      await tx.productVariant.updateMany({
        where: { id: item.productVariantId, academyId },
        data: { stockQuantity: { increment: item.quantity } },
      });
    }
  }
}
