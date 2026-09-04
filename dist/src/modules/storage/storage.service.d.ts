import { ConfigService } from '@nestjs/config';
export interface StoredFile {
    storageKey: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
}
export declare class StorageService {
    private readonly config;
    private readonly logger;
    private readonly driver;
    private readonly basePath;
    constructor(config: ConfigService);
    save(originalName: string, mimeType: string, buffer: Buffer): Promise<StoredFile>;
    read(storageKey: string): Promise<Buffer>;
    delete(storageKey: string): Promise<void>;
    resolvePath(storageKey: string): string;
    private parseCloudinaryKey;
    private saveToCloudinary;
    private readFromCloudinary;
    private saveToLocal;
}
