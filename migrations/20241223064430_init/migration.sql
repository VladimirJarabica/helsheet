-- CreateEnum
CREATE TYPE "Tuning" AS ENUM ('CF');

-- CreateTable
CREATE TABLE "Sheet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tuning" "Tuning" NOT NULL,
    "content" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);
