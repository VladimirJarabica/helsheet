-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('folk_music', 'country', 'sea_shanty');

-- CreateEnum
CREATE TYPE "Country" AS ENUM ('slovakia', 'czech_republic', 'poland', 'hungary', 'austria', 'ireland', 'scotland', 'england', 'fields');

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "country" "Country",
ADD COLUMN     "genre" "Genre";
