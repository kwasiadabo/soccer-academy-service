-- Category is gone from Fees entirely, except for the one bit of real
-- behavior it carried: which fee is "the" registration fee. That becomes its
-- own boolean, backfilled from whichever fee (if any) used to have
-- category = 'REGISTRATION'.
ALTER TABLE "fee_types" ADD COLUMN     "isRegistrationFee" BOOLEAN NOT NULL DEFAULT false;

UPDATE "fee_types" SET "isRegistrationFee" = true WHERE "category" = 'REGISTRATION';

ALTER TABLE "fee_types" DROP COLUMN "category";

DROP TYPE "FeeCategory";
