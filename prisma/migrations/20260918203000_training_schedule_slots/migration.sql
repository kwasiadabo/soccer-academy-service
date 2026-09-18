-- An academy can now train more than once a week (e.g. Tuesday evenings AND Saturday
-- mornings), so the single day/time/location columns on "academy_settings" become a
-- one-to-many "training_schedule_slots" table instead.

-- CreateTable
CREATE TABLE "training_schedule_slots" (
    "id" TEXT NOT NULL,
    "academyId" TEXT NOT NULL DEFAULT current_setting('app.current_academy_id'::text, true),
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_schedule_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "training_schedule_slots_academyId_idx" ON "training_schedule_slots"("academyId");

-- AddForeignKey
ALTER TABLE "training_schedule_slots" ADD CONSTRAINT "training_schedule_slots_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill: one slot per existing academy, preserving its current weekly fixture.
INSERT INTO "training_schedule_slots" ("id", "academyId", "dayOfWeek", "startTime", "endTime", "location", "createdAt", "updatedAt")
SELECT gen_random_uuid(), "academyId", "trainingDayOfWeek", "trainingStartTime", "trainingEndTime", "trainingLocation", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "academy_settings";

-- AlterTable: the old single-slot columns are superseded by training_schedule_slots
-- above. "trainingLocation" is NOT dropped here — it's a separate, still-single
-- public-facing "where do you train" field shown on the marketing page/login screen.
ALTER TABLE "academy_settings" DROP COLUMN "trainingDayOfWeek",
DROP COLUMN "trainingStartTime",
DROP COLUMN "trainingEndTime";
