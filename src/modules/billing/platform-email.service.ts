import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

// SAMS's own outbound email — subscription warnings, not an academy's own
// parent-facing communications (see the academy-scoped EmailService for
// that, which reads AcademySettings instead). Reuses the global
// EMAIL_USER/EMAIL_APP_PASSWORD env vars, orphaned by the multi-tenancy
// migration when academy email became per-academy.
@Injectable()
export class PlatformEmailService {
  private readonly logger = new Logger(PlatformEmailService.name);

  constructor(private readonly config: ConfigService) {}

  // Never throws — a notification failure must not break the billing cron.
  async send(params: { to: string; subject: string; html: string }): Promise<boolean> {
    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_APP_PASSWORD');
    if (!user || !pass) {
      this.logger.warn('Platform email not configured — skipping send');
      return false;
    }
    try {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
      const info = await transporter.sendMail({
        from: `SAMS Billing <${user}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
      this.logger.log(`Platform email sent to ${params.to}: ${info.messageId}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to send platform email to ${params.to}: ${(err as Error).message}`);
      return false;
    }
  }
}
