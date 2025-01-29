-- This is an empty migration.
ALTER TABLE "Sheet" ALTER COLUMN "name" TYPE TEXT COLLATE "unicode";
ALTER TABLE "Sheet" ALTER COLUMN "source" TYPE TEXT COLLATE "unicode";
ALTER TABLE "Sheet" ALTER COLUMN "description" TYPE TEXT COLLATE "unicode";
ALTER TABLE "Sheet" ALTER COLUMN "songAuthor" TYPE TEXT COLLATE "unicode";
ALTER TABLE "Sheet" ALTER COLUMN "originalSheetAuthor" TYPE TEXT COLLATE "unicode";
ALTER TABLE "User" ALTER COLUMN "nickname" TYPE TEXT COLLATE "unicode";