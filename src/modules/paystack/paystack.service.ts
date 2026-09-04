import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type MomoProvider = 'mtn' | 'vod' | 'tgo';

export interface PaystackChargeResult {
  reference: string;
  status: string;
  displayText: string | null;
}

export interface PaystackVerification {
  status: string;
  amount: number;
}

/**
 * Thin wrapper over Paystack's REST API for Ghana mobile-money charges.
 * There is no public webhook receiver in this dev environment, so the flow
 * is initiate -> caller polls verifyTransaction() until status is 'success'.
 */
@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly secretKey?: string;
  private readonly currency: string;

  constructor(private readonly config: ConfigService) {
    this.secretKey = this.config.get<string>('PAYSTACK_SECRET_KEY');
    this.currency = this.config.get<string>('PAYSTACK_CURRENCY', 'GHS');
  }

  private assertConfigured(): string {
    if (!this.secretKey) {
      throw new BadRequestException('Paystack is not configured on this server');
    }
    return this.secretKey;
  }

  async chargeMobileMoney(params: {
    email: string;
    amount: number;
    phone: string;
    provider: MomoProvider;
    reference: string;
  }): Promise<PaystackChargeResult> {
    const secretKey = this.assertConfigured();

    const response = await fetch('https://api.paystack.co/charge', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        amount: Math.round(params.amount * 100),
        currency: this.currency,
        reference: params.reference,
        mobile_money: { phone: params.phone, provider: params.provider },
      }),
    });

    const body = (await response.json()) as {
      status: boolean;
      message?: string;
      data?: { reference: string; status: string; display_text?: string };
    };

    if (!response.ok || !body.status || !body.data) {
      this.logger.warn(`Paystack charge failed: ${JSON.stringify(body)}`);
      throw new BadRequestException(body.message ?? 'Paystack charge could not be initiated');
    }

    return {
      reference: body.data.reference,
      status: body.data.status,
      displayText: body.data.display_text ?? null,
    };
  }

  async verifyTransaction(reference: string): Promise<PaystackVerification> {
    const secretKey = this.assertConfigured();

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });

    const body = (await response.json()) as {
      status: boolean;
      message?: string;
      data?: { status: string; amount: number };
    };

    if (!response.ok || !body.status || !body.data) {
      throw new BadRequestException(body.message ?? 'Could not verify Paystack transaction');
    }

    return { status: body.data.status, amount: body.data.amount / 100 };
  }
}
