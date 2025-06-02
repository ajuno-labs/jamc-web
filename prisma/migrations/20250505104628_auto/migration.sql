/*
  Warnings:

  - You are about to drop the column `examples` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `parentType` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `theory` on the `Lesson` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('VIEW_LESSON', 'UNVIEW_LESSON', 'ASK_QUESTION', 'ANSWER_QUESTION', 'UPVOTE_QUESTION', 'DOWNVOTE_QUESTION', 'UPVOTE_ANSWER', 'DOWNVOTE_ANSWER');

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "examples",
DROP COLUMN "parentId",
DROP COLUMN "parentType",
DROP COLUMN "theory",
ADD COLUMN     "summary" TEXT;

-- CreateTable
CREATE TABLE "LessonView" (
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonView_pkey" PRIMARY KEY ("userId","lessonId")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_userId_type_idx" ON "ActivityLog"("userId", "type");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "LessonView" ADD CONSTRAINT "LessonView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonView" ADD CONSTRAINT "LessonView_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
