-- CreateEnum
CREATE TYPE "TimeSignature" AS ENUM ('sig_3_4', 'sig_4_4', 'sig_2_4');

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "timeSignature" "TimeSignature" NOT NULL DEFAULT 'sig_4_4';
