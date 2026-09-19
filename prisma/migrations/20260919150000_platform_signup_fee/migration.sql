-- Add one-time signup fee to the platform pricing singleton
ALTER TABLE "platform_pricing" ADD COLUMN "signupFee" DECIMAL(10,2) NOT NULL DEFAULT 0;
