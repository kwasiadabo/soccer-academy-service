"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const cloudinary_1 = require("cloudinary");
let StorageService = StorageService_1 = class StorageService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(StorageService_1.name);
        this.driver = this.config.get('STORAGE_DRIVER', 'local');
        this.basePath = this.config.get('STORAGE_LOCAL_PATH', './uploads');
        if (this.driver === 'cloudinary') {
            const url = this.config.get('CLOUDINARY_URL');
            if (!url) {
                throw new Error('CLOUDINARY_URL must be set when STORAGE_DRIVER=cloudinary');
            }
            cloudinary_1.v2.config({ cloudinary_url: url, secure: true });
            this.logger.log('Storage driver: cloudinary');
        }
        else {
            this.logger.log(`Storage driver: local (${this.basePath})`);
        }
    }
    async save(originalName, mimeType, buffer) {
        return this.driver === 'cloudinary'
            ? this.saveToCloudinary(originalName, mimeType, buffer)
            : this.saveToLocal(originalName, mimeType, buffer);
    }
    async read(storageKey) {
        if (this.driver === 'cloudinary') {
            return this.readFromCloudinary(storageKey);
        }
        return fs.readFile(path.join(this.basePath, storageKey));
    }
    async delete(storageKey) {
        if (this.driver === 'cloudinary') {
            const { resourceType, publicId } = this.parseCloudinaryKey(storageKey);
            await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: resourceType });
            return;
        }
        await fs.rm(path.join(this.basePath, storageKey), { force: true });
    }
    resolvePath(storageKey) {
        if (this.driver === 'cloudinary') {
            const { resourceType, publicId } = this.parseCloudinaryKey(storageKey);
            return cloudinary_1.v2.url(publicId, { resource_type: resourceType, secure: true });
        }
        return path.join(this.basePath, storageKey);
    }
    parseCloudinaryKey(storageKey) {
        const [resourceType, ...rest] = storageKey.split('/');
        return { resourceType, publicId: rest.join('/') };
    }
    saveToCloudinary(originalName, mimeType, buffer) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ resource_type: 'auto', folder: 'soccer-academy' }, (error, result) => {
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
            });
            uploadStream.end(buffer);
        });
    }
    async readFromCloudinary(storageKey) {
        const { resourceType, publicId } = this.parseCloudinaryKey(storageKey);
        const url = cloudinary_1.v2.url(publicId, { resource_type: resourceType, secure: true });
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch file from Cloudinary (${response.status}): ${url}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    async saveToLocal(originalName, mimeType, buffer) {
        await fs.mkdir(this.basePath, { recursive: true });
        const ext = path.extname(originalName);
        const storageKey = `${(0, crypto_1.randomUUID)()}${ext}`;
        await fs.writeFile(path.join(this.basePath, storageKey), buffer);
        return {
            storageKey,
            fileName: originalName,
            mimeType,
            sizeBytes: buffer.length,
        };
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map