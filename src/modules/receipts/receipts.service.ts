import { Injectable, Logger } from '@nestjs/common';
import { join } from 'node:path';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../messaging/email.service';
import { SmsService } from '../messaging/sms.service';

function formatGhs(amount: number | string | Prisma.Decimal): string {
  return `GHS ${Number(amount).toFixed(2)}`;
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

interface ReceiptRow {
  label: string;
  amount?: string;
  indent?: boolean;
}

// One row per fee paid. A merchandise invoice's items are broken out into their
// own indented rows (no per-item price — a partial payment can't be split
// across items) with the actual amount paid toward that order on its own row;
// every other fee type keeps its existing single "name: amount" row.
function buildReceiptRows(
  allocations: {
    amount: Prisma.Decimal;
    invoice: {
      description: string | null;
      issuedAt: Date;
      feeType: { name: string; category: string };
      merchandiseOrder: {
        items: { quantity: number; productVariant: { sizeLabel: string; product: { name: string } } }[];
      } | null;
    };
  }[],
): ReceiptRow[] {
  const rows: ReceiptRow[] = [];
  for (const a of allocations) {
    const items = a.invoice.merchandiseOrder?.items ?? [];
    // Recurring monthly-subscription invoices don't carry a per-month description, so the
    // receipt would otherwise just say "Monthly Subscription" with no way to tell which
    // month was paid — append it from the invoice's issued date instead.
    const label =
      a.invoice.description ??
      (a.invoice.feeType.category === 'MONTHLY_SUBSCRIPTION'
        ? `${a.invoice.feeType.name} - ${monthLabel(a.invoice.issuedAt)}`
        : a.invoice.feeType.name);
    if (items.length > 0) {
      rows.push({ label });
      for (const item of items) {
        rows.push({
          label: `${item.productVariant.product.name} (${item.productVariant.sizeLabel}) ×${item.quantity}`,
          indent: true,
        });
      }
      rows.push({ label: 'Amount paid', amount: formatGhs(a.amount) });
    } else {
      rows.push({ label, amount: formatGhs(a.amount) });
    }
  }
  return rows;
}

// Sampled from the app's own theme tokens (src/index.css --primary/--accent), so the
// receipt matches the academy's actual brand colors rather than a guessed palette.
const BRAND = {
  primary: '#ba0329',
  primaryDark: '#970019',
  tint: '#ffedec',
  ink: '#18181b',
  muted: '#71717a',
  border: '#e4e4e7',
};

const LOGO_PATH = join(__dirname, 'assets', 'kapikids-logo.png');
const LOGO_CID = 'kapikids-academy-logo';

@Injectable()
export class ReceiptsService {
  private readonly logger = new Logger(ReceiptsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly sms: SmsService,
  ) {}

  // Best-effort — never throws, so a notification failure never rolls back a
  // payment that has already been recorded.
  async sendPaymentReceipt(paymentId: string): Promise<void> {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          player: { include: { guardians: { include: { guardian: true } } } },
          allocations: {
            include: {
              invoice: {
                include: {
                  feeType: true,
                  merchandiseOrder: {
                    include: { items: { include: { productVariant: { include: { product: true } } } } },
                  },
                },
              },
            },
          },
        },
      });
      if (!payment) return;

      const guardianLink = payment.player.guardians.find((g) => g.isPrimary) ?? payment.player.guardians[0];
      if (!guardianLink) {
        this.logger.warn(`No guardian on file for player ${payment.player.id} — cannot send receipt`);
        return;
      }
      const guardian = guardianLink.guardian;
      const playerName = `${payment.player.firstName} ${payment.player.lastName}`;
      const paidAt = payment.paidAt.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const rows = buildReceiptRows(payment.allocations);
      const total = formatGhs(payment.amount);

      const smsMessage = `Kapikids Soccer Academy: Payment received for ${playerName}. Receipt ${payment.receiptNumber}. Amount: ${total}. Method: ${payment.method}. Thank you!`;

      const subject = `Payment Receipt ${payment.receiptNumber} — Kapikids Soccer Academy`;
      const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: ${BRAND.ink}; border: 1px solid ${BRAND.border}; border-radius: 12px; overflow: hidden;">
          <div style="background: ${BRAND.primary}; padding: 24px; text-align: center;">
            <img src="cid:${LOGO_CID}" alt="Kapikids Soccer Academy" width="64" height="64" style="display: block; margin: 0 auto 8px; border-radius: 50%; background: #fff;" />
            <p style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -0.01em;">Kapikids Soccer Academy</p>
            <p style="color: ${BRAND.tint}; font-size: 13px; margin: 4px 0 0;">Payment Receipt</p>
          </div>
          <div style="padding: 24px; background: #ffffff;">
            <p style="margin: 0 0 4px;"><strong>Receipt:</strong> ${payment.receiptNumber}</p>
            <p style="margin: 0 0 4px;"><strong>Player:</strong> ${playerName}</p>
            <p style="margin: 0 0 16px;"><strong>Date:</strong> ${paidAt}</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              ${rows
                .map(
                  (row) => `<tr>
                    <td style="padding: 6px 0; padding-left: ${row.indent ? '16px' : '0'}; border-bottom: 1px solid ${BRAND.border}; ${row.amount === undefined ? 'font-weight: 700;' : ''}">${row.label}</td>
                    <td style="padding: 6px 0; border-bottom: 1px solid ${BRAND.border}; text-align: right; white-space: nowrap;">${row.amount ?? ''}</td>
                  </tr>`,
                )
                .join('')}
            </table>
            <div style="background: ${BRAND.tint}; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
              <p style="font-size: 16px; margin: 0; color: ${BRAND.primaryDark};"><strong>Total paid: ${total}</strong></p>
            </div>
            <p style="margin: 0;">Method: ${payment.method}${payment.reference ? ` (Ref: ${payment.reference})` : ''}</p>
            <p style="color: ${BRAND.muted}; font-size: 12px; margin-top: 24px;">Thank you for your payment.</p>
          </div>
        </div>
      `;

      const results = await Promise.all([
        guardian.phone ? this.sms.send(guardian.phone, smsMessage) : Promise.resolve(false),
        guardian.email
          ? this.email.send({
              to: guardian.email,
              subject,
              html,
              attachments: [{ filename: 'kapikids-logo.png', path: LOGO_PATH, cid: LOGO_CID }],
            })
          : Promise.resolve(false),
      ]);
      this.logger.log(`Receipt ${payment.receiptNumber}: sms=${results[0]} email=${results[1]}`);
    } catch (err) {
      this.logger.error(`Failed to send payment receipt for payment ${paymentId}: ${(err as Error).message}`);
    }
  }

  // Never throws — a notification failure must not block the reminder endpoint's response.
  async sendPaymentReminder(invoiceId: string): Promise<{ sms: boolean; email: boolean }> {
    try {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          feeType: true,
          player: { include: { guardians: { include: { guardian: true } } } },
        },
      });
      if (!invoice) return { sms: false, email: false };

      const guardianLink = invoice.player.guardians.find((g) => g.isPrimary) ?? invoice.player.guardians[0];
      if (!guardianLink) {
        this.logger.warn(`No guardian on file for player ${invoice.player.id} — cannot send reminder`);
        return { sms: false, email: false };
      }
      const guardian = guardianLink.guardian;
      const playerName = `${invoice.player.firstName} ${invoice.player.lastName}`;
      const amount = formatGhs(invoice.amount);
      const dueDate = invoice.dueDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const smsMessage = `Kapikids Soccer Academy: Payment reminder for ${playerName} — ${invoice.feeType.name}, ${amount} due ${dueDate} (invoice ${invoice.invoiceNumber}). Please settle at your earliest convenience.`;

      const subject = `Payment Reminder — Kapikids Soccer Academy`;
      const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: ${BRAND.ink}; border: 1px solid ${BRAND.border}; border-radius: 12px; overflow: hidden;">
          <div style="background: ${BRAND.primary}; padding: 24px; text-align: center;">
            <img src="cid:${LOGO_CID}" alt="Kapikids Soccer Academy" width="64" height="64" style="display: block; margin: 0 auto 8px; border-radius: 50%; background: #fff;" />
            <p style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -0.01em;">Kapikids Soccer Academy</p>
            <p style="color: ${BRAND.tint}; font-size: 13px; margin: 4px 0 0;">Payment Reminder</p>
          </div>
          <div style="padding: 24px; background: #ffffff;">
            <p style="margin: 0 0 4px;"><strong>Player:</strong> ${playerName}</p>
            <p style="margin: 0 0 4px;"><strong>Fee:</strong> ${invoice.feeType.name}</p>
            <p style="margin: 0 0 16px;"><strong>Due date:</strong> ${dueDate}</p>
            <div style="background: ${BRAND.tint}; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
              <p style="font-size: 16px; margin: 0; color: ${BRAND.primaryDark};"><strong>Amount due: ${amount}</strong></p>
            </div>
            <p style="margin: 0;">Invoice ${invoice.invoiceNumber}</p>
            <p style="color: ${BRAND.muted}; font-size: 12px; margin-top: 24px;">Please settle this at your earliest convenience. Thank you.</p>
          </div>
        </div>
      `;

      const [sms, email] = await Promise.all([
        this.sms.send(guardian.phone, smsMessage),
        guardian.email
          ? this.email.send({
              to: guardian.email,
              subject,
              html,
              attachments: [{ filename: 'kapikids-logo.png', path: LOGO_PATH, cid: LOGO_CID }],
            })
          : Promise.resolve(false),
      ]);
      this.logger.log(`Reminder for invoice ${invoice.invoiceNumber}: sms=${sms} email=${email}`);
      return { sms, email };
    } catch (err) {
      this.logger.error(`Failed to send payment reminder for invoice ${invoiceId}: ${(err as Error).message}`);
      return { sms: false, email: false };
    }
  }
}
