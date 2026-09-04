-- AlterTable: templateId becomes optional (session-scoped assessments rate
-- session activities instead of a template)
ALTER TABLE "player_assessments" ALTER COLUMN "templateId" DROP NOT NULL;

-- AlterTable: criteriaId becomes optional; add sessionActivityId as the alternate target
ALTER TABLE "assessment_ratings" ALTER COLUMN "criteriaId" DROP NOT NULL;
ALTER TABLE "assessment_ratings" ADD COLUMN "sessionActivityId" TEXT;

-- CreateTable
CREATE TABLE "training_session_activities" (
    "id" TEXT NOT NULL,
    "trainingSessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_session_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "training_session_activities_trainingSessionId_idx" ON "training_session_activities"("trainingSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_ratings_playerAssessmentId_sessionActivityId_key" ON "assessment_ratings"("playerAssessmentId", "sessionActivityId");

-- AddForeignKey
ALTER TABLE "training_session_activities" ADD CONSTRAINT "training_session_activities_trainingSessionId_fkey" FOREIGN KEY ("trainingSessionId") REFERENCES "training_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_ratings" ADD CONSTRAINT "assessment_ratings_sessionActivityId_fkey" FOREIGN KEY ("sessionActivityId") REFERENCES "training_session_activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
