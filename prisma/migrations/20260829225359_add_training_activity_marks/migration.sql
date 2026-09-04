-- CreateTable
CREATE TABLE "training_activity_marks" (
    "id" TEXT NOT NULL,
    "trainingActivityId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "ratedByCoachId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_activity_marks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "training_activity_marks_playerId_idx" ON "training_activity_marks"("playerId");

-- CreateIndex
CREATE INDEX "training_activity_marks_ratedByCoachId_idx" ON "training_activity_marks"("ratedByCoachId");

-- CreateIndex
CREATE UNIQUE INDEX "training_activity_marks_trainingActivityId_playerId_key" ON "training_activity_marks"("trainingActivityId", "playerId");

-- AddForeignKey
ALTER TABLE "training_activity_marks" ADD CONSTRAINT "training_activity_marks_trainingActivityId_fkey" FOREIGN KEY ("trainingActivityId") REFERENCES "training_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_activity_marks" ADD CONSTRAINT "training_activity_marks_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_activity_marks" ADD CONSTRAINT "training_activity_marks_ratedByCoachId_fkey" FOREIGN KEY ("ratedByCoachId") REFERENCES "coaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

