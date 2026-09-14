-- AlterTable
ALTER TABLE "academy_settings" ADD COLUMN     "trainingDayOfWeek" INTEGER NOT NULL DEFAULT 6,
ADD COLUMN     "trainingStartTime" TEXT NOT NULL DEFAULT '08:00',
ADD COLUMN     "trainingEndTime" TEXT NOT NULL DEFAULT '10:00';
