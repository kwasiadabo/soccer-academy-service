import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';

export interface AuditEntry {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  beforeData?: unknown;
  afterData?: unknown;
  ipAddress?: string | null;
}

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async record(entry: AuditEntry): Promise<void> {
    const academyId = this.tenantContext.getAcademyId();
    await this.prisma.auditLog.create({
      data: {
        academyId,
        actorUserId: entry.actorUserId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        beforeData: entry.beforeData === undefined ? undefined : (entry.beforeData as object),
        afterData: entry.afterData === undefined ? undefined : (entry.afterData as object),
        ipAddress: entry.ipAddress ?? null,
      },
    });
  }
}
