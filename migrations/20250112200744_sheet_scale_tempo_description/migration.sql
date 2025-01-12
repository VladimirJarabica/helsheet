-- CreateEnum
CREATE TYPE "Scale" AS ENUM ('E_dur', 'A_dur', 'D_dur', 'G_dur', 'C_dur', 'F_dur', 'B_dur', 'Es_dur');

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "description" TEXT,
ADD COLUMN     "scale" "Scale",
ADD COLUMN     "tempo" INTEGER;
