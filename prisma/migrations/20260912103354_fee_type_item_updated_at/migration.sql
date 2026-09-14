-- Tracks when a fee item's amount on a Fee was last set (attached or
-- re-priced) — backfilled to now() for existing rows, then maintained
-- automatically by Prisma's @updatedAt on every future write.
ALTER TABLE "fee_type_items" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
