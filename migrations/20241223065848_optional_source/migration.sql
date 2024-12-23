/*
  Warnings:

  - Added the required column `editSecret` to the `Sheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "editSecret" TEXT NOT NULL,
ALTER COLUMN "sourceText" DROP NOT NULL,
ALTER COLUMN "sourceUrl" DROP NOT NULL;
