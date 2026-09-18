import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../prisma/prisma.service';
import { PlatformEmailService } from './platform-email.service';
import { PlatformPaystackService } from './platform-paystack.service';

const BILLING_PERIOD_DAYS = 30;
const WARNING_WINDOW_DAYS = 5;

export interface SubscriptionStatusView {
  status: 'ACTIVE' | 'PAST_DUE';
  academyStatus: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  daysRemaining: number;
  pricePerPlayer: number;
  activePlayerCount: number;
  estimatedNextAmount: number;
  hasPaymentMethod: boolean;
  cardType: string | null;
  cardLast4: string | null;
  invoices: {
    id: string;
    periodStart: Date;
    periodEnd: Date;
    activePlayerCount: number;
    amount: number;
    status: string;
    paidAt: Date | null;
    createdAt: Date;
  }[];
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
    private readonly paystack: PlatformPaystackService,
    private readonly platformEmail: PlatformEmailService,
  ) {}

  private async getCurrentPricePerPlayer(): Promise<number> {
    const pricing = await this.prisma.platformPricing.findUnique({ where: { id: 'default' } });
    return Number(pricing?.pricePerPlayer ?? 20);
  }

  // Called once, at onboarding — every academy gets a subscription from day one.
  async createInitialSubscription(academyId: string): Promise<void> {
    const pricePerPlayer = await this.getCurrentPricePerPlayer();
    const now = new Date();
    await this.prisma.academySubscription.create({
      data: {
        academyId,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: addDays(now, BILLING_PERIOD_DAYS),
        pricePerPlayerSnapshot: pricePerPlayer,
      },
    });
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatusView> {
    const academyId = this.tenantContext.getAcademyId();
    const [subscription, academy, activePlayerCount, pricePerPlayer, invoices] = await Promise.all([
      this.prisma.academySubscription.findUnique({ where: { academyId } }),
      this.prisma.academy.findUniqueOrThrow({ where: { id: academyId } }),
      this.prisma.player.count({ where: { academyId, status: 'ACTIVE' } }),
      this.getCurrentPricePerPlayer(),
      this.prisma.platformInvoice.findMany({ where: { academyId }, orderBy: { createdAt: 'desc' }, take: 12 }),
    ]);

    if (!subscription) {
      throw new NotFoundException('No subscription found for this academy');
    }

    const daysRemaining = Math.ceil((subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return {
      status: subscription.status,
      academyStatus: academy.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      daysRemaining,
      pricePerPlayer,
      activePlayerCount,
      estimatedNextAmount: activePlayerCount * pricePerPlayer,
      hasPaymentMethod: !!subscription.paystackAuthorizationCode,
      cardType: subscription.paystackCardType,
      cardLast4: subscription.paystackCardLast4,
      invoices: invoices.map((inv) => ({
        id: inv.id,
        periodStart: inv.periodStart,
        periodEnd: inv.periodEnd,
        activePlayerCount: inv.activePlayerCount,
        amount: Number(inv.amount),
        status: inv.status,
        paidAt: inv.paidAt,
        createdAt: inv.createdAt,
      })),
    };
  }

  // Kicks off a real Paystack charge for whatever is currently due (or a
  // token minimum if nothing's owed yet) — its result is what captures the
  // reusable card authorization for every future automatic charge.
  async initializePayment(email: string, callbackUrl: string): Promise<{ authorizationUrl: string; reference: string }> {
    const academyId = this.tenantContext.getAcademyId();
    const [subscription, activePlayerCount, pricePerPlayer] = await Promise.all([
      this.prisma.academySubscription.findUnique({ where: { academyId } }),
      this.prisma.player.count({ where: { academyId, status: 'ACTIVE' } }),
      this.getCurrentPricePerPlayer(),
    ]);
    if (!subscription) {
      throw new NotFoundException('No subscription found for this academy');
    }

    const amount = Math.max(activePlayerCount * pricePerPlayer, pricePerPlayer);
    const reference = `sub_${academyId}_${randomUUID()}`;

    const result = await this.paystack.initializeTransaction({ email, amount, reference, callbackUrl });
    return { authorizationUrl: result.authorizationUrl, reference: result.reference };
  }

  // Called when the academy returns from Paystack's checkout — verifies the
  // charge actually succeeded (never trusts the redirect alone), saves the
  // authorization for future automatic charges, and settles the period.
  async verifyAndApplyPayment(reference: string): Promise<SubscriptionStatusView> {
    const academyId = this.tenantContext.getAcademyId();
    const subscription = await this.prisma.academySubscription.findUnique({ where: { academyId } });
    if (!subscription) {
      throw new NotFoundException('No subscription found for this academy');
    }

    const verification = await this.paystack.verifyTransaction(reference);
    if (verification.status !== 'success') {
      throw new BadRequestException('Payment was not successful');
    }

    const now = new Date();
    const periodStart = subscription.currentPeriodEnd > now ? subscription.currentPeriodEnd : now;
    const periodEnd = addDays(periodStart, BILLING_PERIOD_DAYS);
    const pricePerPlayer = await this.getCurrentPricePerPlayer();
    const activePlayerCount = await this.prisma.player.count({ where: { academyId, status: 'ACTIVE' } });

    await this.prisma.$transaction([
      this.prisma.academySubscription.update({
        where: { academyId },
        data: {
          status: 'ACTIVE',
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          pricePerPlayerSnapshot: pricePerPlayer,
          lastWarningSentAt: null,
          ...(verification.authorization
            ? {
                paystackAuthorizationCode: verification.authorization.authorizationCode,
                paystackAuthorizationEmail: verification.authorization.email,
                paystackCardType: verification.authorization.cardType,
                paystackCardLast4: verification.authorization.last4,
              }
            : {}),
        },
      }),
      this.prisma.platformInvoice.create({
        data: {
          academyId,
          periodStart,
          periodEnd,
          activePlayerCount,
          pricePerPlayer,
          amount: verification.amount,
          status: 'PAID',
          paidAt: now,
          paystackReference: reference,
        },
      }),
      // Only lifts a billing-driven PAST_DUE — never touches a manual SUSPENDED.
      this.prisma.academy.updateMany({ where: { id: academyId, status: 'PAST_DUE' }, data: { status: 'ACTIVE' } }),
    ]);

    return this.getSubscriptionStatus();
  }

  // Runs daily: warns academies approaching expiry, then rolls over (and
  // tries to auto-charge) any whose period has actually ended.
  @Cron('0 6 * * *')
  async handleDailySubscriptionCron(): Promise<void> {
    const academies = await this.prisma.academy.findMany({ where: { status: { in: ['ACTIVE', 'PAST_DUE'] } } });
    for (const academy of academies) {
      await this.tenantContext.run({ academyId: academy.id, slug: academy.slug }, async () => {
        await this.processAcademySubscription(academy.id, academy.slug, academy.status);
      });
    }
  }

  private async processAcademySubscription(academyId: string, slug: string, academyStatus: string): Promise<void> {
    const subscription = await this.prisma.academySubscription.findUnique({ where: { academyId } });
    if (!subscription) {
      this.logger.warn(`Academy ${slug} has no subscription — skipping billing cron for it`);
      return;
    }

    const now = new Date();
    const daysRemaining = Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= WARNING_WINDOW_DAYS && daysRemaining >= 0 && !subscription.lastWarningSentAt) {
      await this.sendExpiryWarning(academyId, slug, daysRemaining);
      await this.prisma.academySubscription.update({ where: { academyId }, data: { lastWarningSentAt: now } });
    }

    if (now < subscription.currentPeriodEnd) {
      return;
    }

    await this.rolloverPeriod(academyId, slug, academyStatus, subscription);
  }

  private async sendExpiryWarning(academyId: string, slug: string, daysRemaining: number): Promise<void> {
    const settings = await this.prisma.academySettings.findUnique({ where: { academyId } });
    const to = settings?.emailUser;
    if (!to) return;
    await this.platformEmail.send({
      to,
      subject: `Your SAMS subscription expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
      html: `<p>Hi ${settings?.brandName ?? slug},</p>
        <p>Your SAMS subscription is due for renewal in <strong>${daysRemaining} day${daysRemaining === 1 ? '' : 's'}</strong>.
        Sign in to your admin dashboard's Billing page to make sure payment goes through — if it lapses, every account
        at your academy will be blocked from signing in until payment is made.</p>`,
    });
  }

  private async rolloverPeriod(
    academyId: string,
    slug: string,
    academyStatus: string,
    subscription: { currentPeriodEnd: Date; paystackAuthorizationCode: string | null; paystackAuthorizationEmail: string | null },
  ): Promise<void> {
    const pricePerPlayer = await this.getCurrentPricePerPlayer();
    const activePlayerCount = await this.prisma.player.count({ where: { academyId, status: 'ACTIVE' } });
    const periodStart = subscription.currentPeriodEnd;
    const periodEnd = addDays(periodStart, BILLING_PERIOD_DAYS);
    const amount = activePlayerCount * pricePerPlayer;

    // Nothing owed — extend for free rather than block an academy with no
    // active players yet (or one that's wound down) over a zero-value invoice.
    if (amount === 0) {
      await this.prisma.$transaction([
        this.prisma.platformInvoice.create({
          data: { academyId, periodStart, periodEnd, activePlayerCount, pricePerPlayer, amount: 0, status: 'PAID', paidAt: new Date() },
        }),
        this.prisma.academySubscription.update({
          where: { academyId },
          data: { currentPeriodStart: periodStart, currentPeriodEnd: periodEnd, pricePerPlayerSnapshot: pricePerPlayer, status: 'ACTIVE', lastWarningSentAt: null },
        }),
      ]);
      if (academyStatus === 'PAST_DUE') {
        await this.prisma.academy.update({ where: { id: academyId }, data: { status: 'ACTIVE' } });
      }
      return;
    }

    const invoice = await this.prisma.platformInvoice.create({
      data: { academyId, periodStart, periodEnd, activePlayerCount, pricePerPlayer, amount, status: 'PENDING' },
    });

    if (subscription.paystackAuthorizationCode && subscription.paystackAuthorizationEmail) {
      const result = await this.paystack.chargeAuthorization({
        email: subscription.paystackAuthorizationEmail,
        amount,
        authorizationCode: subscription.paystackAuthorizationCode,
        reference: invoice.id,
      });

      if (result.status === 'success') {
        await this.prisma.$transaction([
          this.prisma.platformInvoice.update({
            where: { id: invoice.id },
            data: { status: 'PAID', paidAt: new Date(), paystackReference: result.reference },
          }),
          this.prisma.academySubscription.update({
            where: { academyId },
            data: { currentPeriodStart: periodStart, currentPeriodEnd: periodEnd, pricePerPlayerSnapshot: pricePerPlayer, status: 'ACTIVE', lastWarningSentAt: null },
          }),
        ]);
        if (academyStatus === 'PAST_DUE') {
          await this.prisma.academy.update({ where: { id: academyId }, data: { status: 'ACTIVE' } });
        }
        this.logger.log(`Auto-charged academy ${slug}: GHS ${amount} for ${activePlayerCount} active players`);
        return;
      }

      await this.prisma.platformInvoice.update({
        where: { id: invoice.id },
        data: { status: 'FAILED', failureReason: result.message },
      });
    }

    // No saved authorization, or the auto-charge failed: the period has
    // lapsed unpaid — block every account at this academy until payment is
    // made, without touching an academy an admin has manually suspended.
    await this.prisma.academySubscription.update({ where: { academyId }, data: { status: 'PAST_DUE' } });
    if (academyStatus === 'ACTIVE') {
      await this.prisma.academy.update({ where: { id: academyId }, data: { status: 'PAST_DUE' } });
      this.logger.warn(`Academy ${slug} blocked: subscription lapsed unpaid`);
    }
  }
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
