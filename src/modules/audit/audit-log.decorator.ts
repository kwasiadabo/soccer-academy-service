import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'audit_log_meta';

export interface AuditLogMeta {
  action: string;
  entityType: string;
}

export const AuditLog = (meta: AuditLogMeta) => SetMetadata(AUDIT_LOG_KEY, meta);
