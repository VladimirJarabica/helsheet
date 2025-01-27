/*
  Warnings:

  - You are about to drop the `_like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_like" DROP CONSTRAINT "_like_A_fkey";

-- DropForeignKey
ALTER TABLE "_like" DROP CONSTRAINT "_like_B_fkey";

-- DropTable
DROP TABLE "_like";
