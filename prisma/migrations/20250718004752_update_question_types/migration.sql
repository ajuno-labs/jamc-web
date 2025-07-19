/*
  Warnings:

  - The values [YOLO,FORMAL] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('OBJECTIVE', 'STRUCTURED', 'OPINION');
ALTER TABLE "Question" ALTER COLUMN "type" TYPE "QuestionType_new" USING ("type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "classificationConfidence" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "classificationReasoning" TEXT[] DEFAULT ARRAY[]::TEXT[];
