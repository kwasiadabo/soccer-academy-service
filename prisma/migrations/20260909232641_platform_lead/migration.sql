-- CreateTable
CREATE TABLE "platform_leads" (
    "id" TEXT NOT NULL,
    "academyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "message" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_leads_pkey" PRIMARY KEY ("id")
);

