"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16),
    JWT_ACCESS_TTL: zod_1.z.string().default('15m'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16),
    JWT_REFRESH_TTL: zod_1.z.string().default('7d'),
    PORT: zod_1.z.coerce.number().default(3000),
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
    STORAGE_DRIVER: zod_1.z.enum(['local', 'cloudinary']).default('local'),
    STORAGE_LOCAL_PATH: zod_1.z.string().default('./uploads'),
    CLOUDINARY_URL: zod_1.z.string().optional(),
    PAYSTACK_SECRET_KEY: zod_1.z.string().optional(),
    PAYSTACK_PUBLIC_KEY: zod_1.z.string().optional(),
    PAYSTACK_CURRENCY: zod_1.z.string().default('GHS'),
    NALO_API_KEY: zod_1.z.string().optional(),
    NALO_SENDER_ID: zod_1.z.string().optional(),
    NALO_ENDPOINT: zod_1.z.string().optional(),
    EMAIL_USER: zod_1.z.string().optional(),
    EMAIL_APP_PASSWORD: zod_1.z.string().optional(),
});
function validateEnv(config) {
    const result = exports.envSchema.safeParse(config);
    if (!result.success) {
        throw new Error(`Invalid environment configuration: ${result.error.message}`);
    }
    return result.data;
}
//# sourceMappingURL=env.validation.js.map