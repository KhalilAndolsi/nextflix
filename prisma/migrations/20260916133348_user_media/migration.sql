-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('WATCHLIST', 'FAVORITE', 'HISTORY');

-- CreateTable
CREATE TABLE "user_media" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "season" INTEGER,
    "episode" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_media_userId_kind_updatedAt_idx" ON "user_media"("userId", "kind", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_media_userId_mediaType_mediaId_kind_key" ON "user_media"("userId", "mediaType", "mediaId", "kind");

-- AddForeignKey
ALTER TABLE "user_media" ADD CONSTRAINT "user_media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
