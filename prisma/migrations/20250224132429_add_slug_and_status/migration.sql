/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLOSED', 'SOLVED');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OPEN';

-- CreateIndex
CREATE UNIQUE INDEX "Question_slug_key" ON "Question"("slug");
