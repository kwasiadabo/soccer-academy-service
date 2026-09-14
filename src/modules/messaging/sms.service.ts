import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../prisma/prisma.service';

function toGhanaMsisdn(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+233')) return digits.slice(1);
  if (digits.startsWith('233')) return digits;
  if (digits.startsWith('0')) return `233${digits.slice(1)}`;
  return digits;
}

// Each academy brings its own Nalo API key and sender ID (stored in
// AcademySettings), resolved per call from the current tenant. The endpoint
// itself is shared platform config, not per-academy.
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly endpoint: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {
    this.endpoint =
      this.config.get<string>('NALO_ENDPOINT') ??
      'https://sms.nalosolutions.com/smsbackend/Resl_Nalo/send-message/';
  }

  // Never throws — a notification failure must not roll back a real payment.
  async send(phone: string, message: string): Promise<boolean> {
    const academyId = this.tenantContext.getAcademyId();
    const settings = await this.prisma.academySettings.findUnique({ where: { academyId } });
    if (!settings?.smsApiKey) {
      this.logger.warn(`SMS not configured for academy ${academyId} — skipping send`);
      return false;
    }
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: settings.smsApiKey,
          msisdn: toGhanaMsisdn(phone),
          message,
          sender_id: settings.smsSenderId ?? settings.brandName,
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
