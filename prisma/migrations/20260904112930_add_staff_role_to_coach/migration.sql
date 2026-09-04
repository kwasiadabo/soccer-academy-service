-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('COACH', 'KITMAN', 'RECEPTIONIST_CASHIER', 'MEDIA');

-- AlterTable
ALTER TABLE "coaches" ADD COLUMN     "role" "StaffRole" NOT NULL DEFAULT 'COACH';

