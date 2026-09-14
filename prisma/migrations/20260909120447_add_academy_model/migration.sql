-- CreateEnum
CREATE TYPE "AcademyStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING');

-- CreateTable
CREATE TABLE "academies" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AcademyStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academies_slug_key" ON "academies"("slug");

