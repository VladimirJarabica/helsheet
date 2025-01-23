-- CreateEnum
CREATE TYPE "SongAuthorType" AS ENUM ('folk_song', 'original_song');

-- AlterEnum
ALTER TYPE "Scale" ADD VALUE 'As_dur';

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "noteSheetAuthor" TEXT,
ADD COLUMN     "songAuthor" TEXT,
ADD COLUMN     "songAuthorType" "SongAuthorType" NOT NULL DEFAULT 'folk_song';
