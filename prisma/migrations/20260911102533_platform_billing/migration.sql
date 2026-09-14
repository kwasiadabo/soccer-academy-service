-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE');

-- CreateEnum
CREATE TYPE "PlatformInvoiceStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterEnum
ALTER TYPE "AcademyStatus" ADD VALUE 'PAST_DUE';

-- AlterTable (expand -> backfill -> contract: existing leads didn't capture a
-- training location, so backfill with a placeholder before enforcing NOT NULL)
ALTER TABLE "platform_leads" ADD COLUMN     "trainingLocation" TEXT;
UPDATE "platform_leads" SET "trainingLocation" = 'Not provided' WHERE "trainingLocation" IS NULL;
ALTER TABLE "platform_leads" ALTER COLUMN "trainingLocation" SET NOT NULL;

-- CreateTable
CREATE TABLE "platform_pricing" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "pricePerPlayer" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy_subscriptions" (
    "academyId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "pricePerPlayerSnapshot" DECIMAL(10,2) NOT NULL,
    "paystackAuthorizationCode" TEXT,
    "paystackAuthorizationEmail" TEXT,
    "paystackCardType" TEXT,
    "paystackCardLast4" TEXT,
    "lastWarningSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academy_subscriptions_pkey" PRIMARY KEY ("academyId")
);

-- CreateTable
CREATE TABLE "platform_invoices" (
    "id" TEXT NOT NULL,
    "academyId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "activePlayerCount" INTEGER NOT NULL,
    "pricePerPlayer" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PlatformInvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "paystackReference" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "platform_invoices_academyId_idx" ON "platform_invoices"("academyId");

-- AddForeignKey
ALTER TABLE "academy_subscriptions" ADD CONSTRAINT "academy_subscriptions_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_invoices" ADD CONSTRAINT "platform_invoices_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academy_subscriptions"("academyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed the default price: GHS 20 / active player / month.
INSERT INTO "platform_pricing" ("id", "pricePerPlayer", "currency", "updatedAt")
VALUES ('default', 20.00, 'GHS', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Backfill a subscription for every academy that was onboarded before this
-- migration existed, so the billing cron has something to evaluate for them
-- too. Gives each a fresh 30-day period starting now, at the current price.
INSERT INTO "academy_subscriptions" ("academyId", "status", "currentPeriodStart", "currentPeriodEnd", "pricePerPlayerSnapshot", "createdAt", "updatedAt")
SELECT "id", 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', 20.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "academies"
ON CONFLICT ("academyId") DO NOTHING;
