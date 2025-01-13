-- CreateEnum
CREATE TYPE "SheetAccess" AS ENUM ('public', 'private');

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "access" "SheetAccess" NOT NULL DEFAULT 'public';
