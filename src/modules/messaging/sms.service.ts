import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

function toGhanaMsisdn(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+233')) return digits.slice(1);
  if (digits.startsWith('233')) return digits;
  if (digits.startsWith('0')) return `233${digits.slice(1)}`;
  return digits;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey?: string;
  private readonly senderId: string;
  private readonly endpoint: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('NALO_API_KEY');
    this.senderId = this.config.get<string>('NALO_SENDER_ID') ?? 'Kapikids';
    this.endpoint =
      this.config.get<string>('NALO_ENDPOINT') ??
      'https://sms.nalosolutions.com/smsbackend/Resl_Nalo/send-message/';
  }

  // Never throws — a notification failure must not roll back a real payment.
  async send(phone: string, message: string): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.warn('SMS not configured (NALO_API_KEY missing) — skipping send');
      return false;
    }
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: this.apiKey,
          msisdn: toGhanaMsisdn(phone),
          message,
          sender_id: this.senderId,
          type: '0',
        }),
      });
      const body = await response.text();
      this.logger.log(`Nalo SMS response for ${phone}: HTTP ${response.status} — ${body}`);
      return response.ok;
    } catch (err) {
      this.logger.error(`Failed to send SMS to ${phone}: ${(err as Error).message}`);
      return false;
    }
  }
}
