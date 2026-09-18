import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// SAMS's own outbound email — subscription warnings and password resets,
// not an academy's own parent-facing communications (see the academy-scoped
// EmailService for that, which reads AcademySettings instead).
//
// Sent via Resend with a verified sending domain (RESEND_API_KEY/
// RESEND_FROM_EMAIL) rather than a personal Gmail relay — Gmail's SMTP
// accepts and relays the message fine, but third-party inboxes (Yahoo in
// particular) silently drop mail from an unverified personal sender with no
// bounce, which is invisible from here. Falls back to the old Gmail relay
// (EMAIL_USER/EMAIL_APP_PASSWORD, orphaned by the multi-tenancy migration
// when academy email became per-academy) only if Resend isn't configured.
@Injectable()
export class PlatformEmailService {
  private readonly logger = new Logger(PlatformEmailService.name);

  constructor(private readonly config: ConfigService) {}

  // Never throws — a notification failure must not break the billing cron.
  async send(params: { to: string; subject: string; html: string }): Promise<boolean> {
    const resendApiKey = this.config.get<string>('RESEND_API_KEY');
    const resendFrom = this.config.get<string>('RESEND_FROM_EMAIL');
    if (resendApiKey && resendFrom) {
      return this.sendViaResend(resendApiKey, resendFrom, params);
    }
    return this.sendViaGmailFallback(params);
  }

  private async sendViaResend(
    apiKey: string,
    from: string,
    params: { to: string; subject: string; html: string },
  ): Promise<boolean> {
    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: `SAMS <${from}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
      if (error) {
        this.logger.error(`Failed to send platform email to ${params.to}: ${error.message}`);
        return false;
      }
      this.logger.log(`Platform email sent to ${params.to}: ${data?.id}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to send platform email to ${params.to}: ${(err as Error).message}`);
      return false;
    }
  }

  private async sendViaGmailFallback(params: { to: string; subject: string; html: string }): Promise<boolean> {
    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_APP_PASSWORD');
    if (!user || !pass) {
      this.logger.warn('Platform email not configured — skipping send');
      return false;
    }
    try {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
      const info = await transporter.sendMail({
        from: `SAMS <${user}>`,
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
