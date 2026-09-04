-- CreateEnum
CREATE TYPE "GalleryPhotoContext" AS ENUM ('SATURDAY_TRAINING', 'MATCH');

-- CreateTable
CREATE TABLE "player_of_the_week" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "trainingSessionId" TEXT NOT NULL,
    "weekOf" TIMESTAMP(3) NOT NULL,
    "averageRating" DECIMAL(4,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_of_the_week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_photos" (
    "id" TEXT NOT NULL,
    "context" "GalleryPhotoContext" NOT NULL,
    "storageKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "uploadedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_of_the_week_trainingSessionId_key" ON "player_of_the_week"("trainingSessionId");

-- CreateIndex
CREATE INDEX "player_of_the_week_playerId_idx" ON "player_of_the_week"("playerId");

-- CreateIndex
CREATE INDEX "player_of_the_week_teamId_idx" ON "player_of_the_week"("teamId");

-- CreateIndex
CREATE INDEX "player_of_the_week_weekOf_idx" ON "player_of_the_week"("weekOf");

-- CreateIndex
CREATE INDEX "gallery_photos_context_idx" ON "gallery_photos"("context");

-- AddForeignKey
ALTER TABLE "player_of_the_week" ADD CONSTRAINT "player_of_the_week_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_of_the_week" ADD CONSTRAINT "player_of_the_week_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_of_the_week" ADD CONSTRAINT "player_of_the_week_trainingSessionId_fkey" FOREIGN KEY ("trainingSessionId") REFERENCES "training_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

