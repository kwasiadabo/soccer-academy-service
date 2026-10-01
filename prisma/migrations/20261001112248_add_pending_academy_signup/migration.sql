-- CreateTable
CREATE TABLE "pending_academy_signups" (
    "id" TEXT NOT NULL,
    "resumeToken" TEXT NOT NULL,
    "paystackReference" TEXT NOT NULL,
    "frontendOrigin" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "adminFirstName" TEXT NOT NULL,
    "adminLastName" TEXT NOT NULL,
    "adminPasswordHash" TEXT NOT NULL,
    "reminderSentAt" TIMESTAMP(3),
    "deletionWarningSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_academy_signups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pending_academy_signups_resumeToken_key" ON "pending_academy_signups"("resumeToken");

-- CreateIndex
CREATE UNIQUE INDEX "pending_academy_signups_paystackReference_key" ON "pending_academy_signups"("paystackReference");
