/*
  Warnings:

  - The values [fields] on the enum `Country` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Country_new" AS ENUM ('slovakia', 'czech_republic', 'poland', 'hungary', 'austria', 'ireland', 'scotland', 'england', 'france');
ALTER TABLE "Sheet" ALTER COLUMN "country" TYPE "Country_new" USING ("country"::text::"Country_new");
ALTER TYPE "Country" RENAME TO "Country_old";
ALTER TYPE "Country_new" RENAME TO "Country";
DROP TYPE "Country_old";
COMMIT;
