import { ConfigService } from '@nestjs/config';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
export interface StoredFile {
    storageKey: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
}
export declare class StorageService {
    private readonly config;
    private readonly tenantContext;
    private readonly logger;
    private readonly driver;
    private readonly basePath;
    constructor(config: ConfigService, tenantContext: TenantContextService);
    save(originalName: string, mimeType: string, buffer: Buffer): Promise<StoredFile>;
    read(storageKey: string): Promise<Buffer>;
    delete(storageKey: string): Promise<void>;
    resolvePath(storageKey: string): string;
    private parseCloudinaryKey;
    private saveToCloudinary;
    private readFromCloudinary;
    private saveToLocal;
}
