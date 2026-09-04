export declare const AUDIT_LOG_KEY = "audit_log_meta";
export interface AuditLogMeta {
    action: string;
    entityType: string;
}
export declare const AuditLog: (meta: AuditLogMeta) => import("@nestjs/common").CustomDecorator<string>;
