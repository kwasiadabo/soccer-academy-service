-- AlterTable
ALTER TABLE "pending_academy_signups" ADD COLUMN "paymentLinkExpiresAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '3 days');

-- Drop the default now that existing rows (if any) are backfilled — every
-- future row must set this explicitly from application code.
ALTER TABLE "pending_academy_signups" ALTER COLUMN "paymentLinkExpiresAt" DROP DEFAULT;
