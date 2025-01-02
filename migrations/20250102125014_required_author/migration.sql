/*
  Warnings:

  - Made the column `authorId` on table `Sheet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sheet" DROP CONSTRAINT "Sheet_authorId_fkey";

-- AlterTable
ALTER TABLE "Sheet" ALTER COLUMN "authorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
