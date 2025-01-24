/*
  Warnings:

  - You are about to drop the column `noteSheetAuthor` on the `Sheet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "noteSheetAuthor",
ADD COLUMN     "originalSheetAuthor" TEXT;
