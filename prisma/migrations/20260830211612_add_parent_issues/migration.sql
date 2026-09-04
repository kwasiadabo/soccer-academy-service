-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "parent_issues" (
    "id" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "submittedByUserId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_messages" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "isStaffReply" BOOLEAN NOT NULL,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issue_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "parent_issues_guardianId_idx" ON "parent_issues"("guardianId");

-- CreateIndex
CREATE INDEX "issue_messages_issueId_idx" ON "issue_messages"("issueId");

-- AddForeignKey
ALTER TABLE "parent_issues" ADD CONSTRAINT "parent_issues_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "guardians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_issues" ADD CONSTRAINT "parent_issues_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_messages" ADD CONSTRAINT "issue_messages_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "parent_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_messages" ADD CONSTRAINT "issue_messages_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
