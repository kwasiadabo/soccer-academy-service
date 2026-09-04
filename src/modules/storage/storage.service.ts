import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v2 as cloudinary } from 'cloudinary';

export interface StoredFile {
  storageKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

/**
 * Abstraction over file storage. Driven by STORAGE_DRIVER ('local' | 'cloudinary')
 * so callers only ever deal with an opaque storageKey — swapping the backing
 * store never requires touching players.service.ts / parent-portal.service.ts.
 *
 * Cloudinary storageKeys are encoded as "<resource_type>/<public_id>" so read()
 * and delete() can reconstruct the delivery URL / destroy call without a schema change.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly driver: 'local' | 'cloudinary';
  private readonly basePath: string;

  constructor(private readonly config: ConfigService) {
    this.driver = this.config.get<'local' | 'cloudinary'>('STORAGE_DRIVER', 'local');
    this.basePath = this.config.get<string>('STORAGE_LOCAL_PATH', './uploads');

    if (this.driver === 'cloudinary') {
      const url = this.config.get<string>('CLOUDINARY_URL');
      if (!url) {
        throw new Error('CLOUDINARY_URL must be set when STORAGE_DRIVER=cloudinary');
      }
      cloudinary.config({ cloudinary_url: url, secure: true });
      this.logger.log('Storage driver: cloudinary');
    } else {
      this.logger.log(`Storage driver: local (${this.basePath})`);
    }
  }

  async save(originalName: string, mimeType: string, buffer: Buffer): Promise<StoredFile> {
    return this.driver === 'cloudinary'
      ? this.saveToCloudinary(originalName, mimeType, buffer)
      : this.saveToLocal(originalName, mimeType, buffer);
  }

  async read(storageKey: string): Promise<Buffer> {
    if (this.driver === 'cloudinary') {
      return this.readFromCloudinary(storageKey);
    }
    return fs.readFile(path.join(this.basePath, storageKey));
  }

  async delete(storageKey: string): Promise<void> {
    if (this.driver === 'cloudinary') {
      const { resourceType, publicId } = this.parseCloudinaryKey(storageKey);
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return;
    }
    await fs.rm(path.join(this.basePath, storageKey), { force: true });
  }

  /** Local driver: absolute file path. Cloudinary driver: public delivery URL. */
  resolvePath(storageKey: string): string {
    if (this.driver === 'cloudinary') {
      const { resourceType, publicId } = this.parseCloudinaryKey(storageKey);
      return cloudinary.url(publicId, { resource_type: resourceType, secure: true });
    }
    return path.join(this.basePath, storageKey);
  }

  private parseCloudinaryKey(storageKey: string): { resourceType: string; publicId: string } {
    const [resourceType, ...rest] = storageKey.split('/');
    return { resourceType, publicId: rest.join('/') };
  }

  private saveToCloudinary(originalName: string, mimeType: string, buffer: Buffer): Promise<StoredFile> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'soccer-academy' },
        (error, result) => {
          if (error || !result) {
            reject(error instanceof Error ? error : new Error('Cloudinary upload failed'));
            return;
          }
          resolve({
            storageKey: `${result.resource_type}/${result.public_id}`,
            fileName: originalName,
            mimeType,
            sizeBytes: result.bytes,
          });
        },
      );
      uploadStream.end(buffer);
    });
  }

  private async readFromCloudinary(storageKey: string): Promise<Buffer> {
    const { resourceType, publicId } = this.parseCloudinaryKey(storageKey);
    const url = cloudinary.url(publicId, { resource_type: resourceType, secure: true });
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from Cloudinary (${response.status}): ${url}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private async saveToLocal(originalName: string, mimeType: string, buffer: Buffer): Promise<StoredFile> {
    await fs.mkdir(this.basePath, { recursive: true });
    const ext = path.extname(originalName);
    const storageKey = `${randomUUID()}${ext}`;
    await fs.writeFile(path.join(this.basePath, storageKey), buffer);

    return {
      storageKey,
      fileName: originalName,
      mimeType,
      sizeBytes: buffer.length,
    };
  }
}
