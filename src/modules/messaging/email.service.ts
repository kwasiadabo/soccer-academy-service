import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PrismaService } from '../prisma/prisma.service';

// Each academy brings its own email account (its own Gmail address + app
// password, stored in AcademySettings) and its own display/brand name for the
// "from" header — resolved per call from the current tenant.
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  // Never throws — a notification failure must not roll back a real payment.
  async send(params: { to: string; subject: string; html: string }): Promise<boolean> {
    const academyId = this.tenantContext.getAcademyId();
    const settings = await this.prisma.academySettings.findUnique({ where: { academyId } });
    if (!settings?.emailUser || !settings?.emailAppPassword) {
      this.logger.warn(`Email not configured for academy ${academyId} — skipping send`);
      return false;
    }
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: settings.emailUser, pass: settings.emailAppPassword },
      });
      const info = await transporter.sendMail({
        from: `${settings.brandName} <${settings.emailUser}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
      this.logger.log(`Email sent to ${params.to}: ${info.messageId}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to send email to ${params.to}: ${(err as Error).message}`);
      return false;
    }
  }
}
