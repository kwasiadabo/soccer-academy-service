import { Injectable } from '@nestjs/common';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PlatformEmailService } from '../billing/platform-email.service';

// An academy's own parent-facing email (receipts, reminders, etc.) — sent
// through the same single platform mail sender everything else uses (see
// PlatformEmailService), not a Gmail account of the academy's own. Only the
// "from" display name changes per call, to the current tenant's own slug
// (e.g. "kapikids@sams"), so a parent can tell which academy an email came
// from regardless of branding.
@Injectable()
export class EmailService {
  constructor(
    private readonly platformEmail: PlatformEmailService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async send(params: { to: string; subject: string; html: string }): Promise<boolean> {
    return this.platformEmail.send({ ...params, fromName: `${this.tenantContext.getSlug()}@sams` });
  }
}
