import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter | null;
  private readonly fromAddress?: string;

  constructor(private readonly config: ConfigService) {
    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_APP_PASSWORD');
    this.fromAddress = user;
    this.transporter =
      user && pass ? nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }) : null;
  }

  // Never throws — a notification failure must not roll back a real payment.
  async send(params: {
    to: string;
    subject: string;
    html: string;
    attachments?: { filename: string; path: string; cid: string }[];
  }): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn('Email not configured (EMAIL_USER/EMAIL_APP_PASSWORD missing) — skipping send');
      return false;
    }
    try {
      const info = await this.transporter.sendMail({
        from: `Kapikids Soccer Academy <${this.fromAddress}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
        attachments: params.attachments,
      });
      this.logger.log(`Email sent to ${params.to}: ${info.messageId}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to send email to ${params.to}: ${(err as Error).message}`);
      return false;
    }
  }
}
