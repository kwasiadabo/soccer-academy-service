import { z } from 'zod';

export const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	JWT_ACCESS_SECRET: z.string().min(16),
	JWT_ACCESS_TTL: z.string().default('15m'),
	JWT_REFRESH_SECRET: z.string().min(16),
	JWT_REFRESH_TTL: z.string().default('7d'),
	JWT_PLATFORM_ADMIN_SECRET: z.string().min(16),
	JWT_PLATFORM_ADMIN_TTL: z.string().default('12h'),
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	CORS_ORIGIN: z.string().default('http://sams.variablexsolutions.com'),
	STORAGE_DRIVER: z.enum(['local', 'cloudinary']).default('local'),
	STORAGE_LOCAL_PATH: z.string().default('./uploads'),
	CLOUDINARY_URL: z.string().optional(),
	// Orphaned by the multi-tenancy migration (Paystack became per-academy, in
	// AcademySettings) until now: reused as SAMS's own merchant account for
	// billing academies for the platform itself (see BillingService) — never
	// used to collect a parent's player fees, which stay on the academy's own keys.
	PAYSTACK_SECRET_KEY: z.string().optional(),
	PAYSTACK_PUBLIC_KEY: z.string().optional(),
	PAYSTACK_CURRENCY: z.string().default('GHS'),
	NALO_API_KEY: z.string().optional(),
	NALO_SENDER_ID: z.string().optional(),
	NALO_ENDPOINT: z.string().optional(),
	// Likewise reused as SAMS's own outbound address for subscription-warning
	// emails (see BillingService) — an academy's own EmailService/AcademySettings
	// pair is unrelated and still only used for that academy's own parent comms.
	EMAIL_USER: z.string().optional(),
	EMAIL_APP_PASSWORD: z.string().optional(),
	// PlatformEmailService's actual transport — a personal Gmail relay is
	// unreliable for third-party inboxes (Yahoo in particular tends to
	// silently drop it with no bounce), so platform email goes through Resend
	// with a verified sending domain instead. EMAIL_USER/EMAIL_APP_PASSWORD
	// above are kept only as a fallback for when this isn't configured.
	RESEND_API_KEY: z.string().optional(),
	RESEND_FROM_EMAIL: z.string().optional(),
	// Where "Request a walkthrough" lead notifications go (see
	// PlatformAdminService#notifyNewLead) — falls back to SAMS's own contact
	// address if unset.
	SAMS_LEADS_NOTIFICATION_EMAIL: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
	const result = envSchema.safeParse(config);
	if (!result.success) {
		throw new Error(
			`Invalid environment configuration: ${result.error.message}`,
		);
	}
	return result.data;
}
