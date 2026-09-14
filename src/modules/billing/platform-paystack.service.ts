import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PaystackInitializeResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface PaystackAuthorization {
  authorizationCode: string;
  email: string;
  cardType: string | null;
  last4: string | null;
  reusable: boolean;
}

export interface PaystackChargeResult {
  status: 'success' | 'failed';
  reference: string;
  amount: number;
  message: string | null;
}

// SAMS's own Paystack account — collecting what an academy owes SAMS for the
// platform itself, never a parent's player fees (see PaystackService for
// that, which reads each academy's own keys from AcademySettings instead).
// Reuses the global PAYSTACK_SECRET_KEY/PAYSTACK_PUBLIC_KEY env vars, orphaned
// by the multi-tenancy migration when player-fee collection became per-academy.
@Injectable()
export class PlatformPaystackService {
  private readonly logger = new Logger(PlatformPaystackService.name);

  constructor(private readonly config: ConfigService) {}

  private getSecretKey(): string {
    const key = this.config.get<string>('PAYSTACK_SECRET_KEY');
    if (!key) {
      throw new BadRequestException(
        'SAMS platform billing is not configured yet — PAYSTACK_SECRET_KEY is unset.',
      );
    }
    return key;
  }

  getPublicKey(): string {
    const key = this.config.get<string>('PAYSTACK_PUBLIC_KEY');
    if (!key) {
      throw new BadRequestException(
        'SAMS platform billing is not configured yet — PAYSTACK_PUBLIC_KEY is unset.',
      );
    }
    return key;
  }

  private getCurrency(): string {
    return this.config.get<string>('PAYSTACK_CURRENCY') ?? 'GHS';
  }

  // First step of capturing a reusable authorization: a real charge for the
  // amount currently due, which — if the academy pays by card — returns an
  // authorization_code this service can reuse every following period without
  // the academy re-entering anything (see chargeAuthorization below).
  async initializeTransaction(params: {
    email: string;
    amount: number;
    reference: string;
    callbackUrl: string;
  }): Promise<PaystackInitializeResult> {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getSecretKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        amount: Math.round(params.amount * 100),
        currency: this.getCurrency(),
        reference: params.reference,
        callback_url: params.callbackUrl,
      }),
    });

    const body = (await response.json()) as {
      status: boolean;
      message?: string;
      data?: { authorization_url: string; access_code: string; reference: string };
    };

    if (!response.ok || !body.status || !body.data) {
      this.logger.warn(`Paystack initialize failed: ${JSON.stringify(body)}`);
      throw new BadRequestException(body.message ?? 'Could not start payment with Paystack');
    }

    return {
      authorizationUrl: body.data.authorization_url,
      accessCode: body.data.access_code,
      reference: body.data.reference,
    };
  }

  async verifyTransaction(
    reference: string,
  ): Promise<{ status: string; amount: number; authorization: PaystackAuthorization | null }> {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${this.getSecretKey()}` },
    });

    const body = (await response.json()) as {
      status: boolean;
      message?: string;
      data?: {
        status: string;
        amount: number;
        customer?: { email: string };
        authorization?: {
          authorization_code: string;
          card_type?: string;
          last4?: string;
          reusable: boolean;
        };
      };
    };

    if (!response.ok || !body.status || !body.data) {
      throw new BadRequestException(body.message ?? 'Could not verify Paystack transaction');
    }

    const auth = body.data.authorization;
    return {
      status: body.data.status,
      amount: body.data.amount / 100,
      authorization:
        auth && auth.reusable
          ? {
              authorizationCode: auth.authorization_code,
              email: body.data.customer?.email ?? '',
              cardType: auth.card_type ?? null,
              last4: auth.last4 ?? null,
              reusable: auth.reusable,
            }
          : null,
    };
  }

  // The actually-recurring part: reuses a previously captured authorization to
  // charge the academy again with no user interaction. Paystack only
  // guarantees this works for card authorizations, and only outside Nigeria
  // for cards specifically (see recurring-charges docs) — a momo-only academy
  // may still need a fresh initializeTransaction() each period.
  async chargeAuthorization(params: {
    email: string;
    amount: number;
    authorizationCode: string;
    reference: string;
  }): Promise<PaystackChargeResult> {
    const response = await fetch('https://api.paystack.co/transaction/charge_authorization', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getSecretKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        amount: Math.round(params.amount * 100),
        currency: this.getCurrency(),
        authorization_code: params.authorizationCode,
        reference: params.reference,
      }),
    });

    const body = (await response.json()) as {
      status: boolean;
      message?: string;
      data?: { status: string; amount: number; reference: string };
    };

    if (!response.ok || !body.status || !body.data) {
      return {
        status: 'failed',
        reference: params.reference,
        amount: params.amount,
        message: body.message ?? 'Charge failed',
      };
    }

    return {
      status: body.data.status === 'success' ? 'success' : 'failed',
      reference: body.data.reference,
      amount: body.data.amount / 100,
      message: null,
    };
  }
}
