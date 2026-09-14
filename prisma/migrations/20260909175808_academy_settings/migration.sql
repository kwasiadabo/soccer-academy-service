-- CreateTable
CREATE TABLE "academy_settings" (
    "academyId" TEXT NOT NULL,
    "paystackSecretKey" TEXT,
    "paystackPublicKey" TEXT,
    "paystackCurrency" TEXT NOT NULL DEFAULT 'GHS',
    "smsApiKey" TEXT,
    "smsSenderId" TEXT,
    "emailUser" TEXT,
    "emailAppPassword" TEXT,
    "brandName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academy_settings_pkey" PRIMARY KEY ("academyId")
);

-- AddForeignKey
ALTER TABLE "academy_settings" ADD CONSTRAINT "academy_settings_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: every existing academy gets a settings row, using its own display
-- name as a starting brandName. Actual integration credentials (Paystack, SMS,
-- email) are deliberately NOT set here — this file is committed to version
-- control, and those are live secrets. They're populated directly against the
-- database, out of band, immediately after this migration runs.
INSERT INTO "academy_settings" ("academyId", "brandName", "updatedAt")
SELECT "id", "name", now() FROM "academies"
ON CONFLICT ("academyId") DO NOTHING;
