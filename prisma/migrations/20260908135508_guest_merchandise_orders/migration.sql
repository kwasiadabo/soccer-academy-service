-- DropForeignKey
ALTER TABLE "merchandise_orders" DROP CONSTRAINT "merchandise_orders_submittedByUserId_fkey";

-- AlterTable
ALTER TABLE "merchandise_orders" ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ALTER COLUMN "submittedByUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "merchandise_orders" ADD CONSTRAINT "merchandise_orders_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
