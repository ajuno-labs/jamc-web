/*
  Warnings:

  - You are about to drop the column `isAccepted` on the `Answer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "isAccepted",
ADD COLUMN     "acceptedByTeacherId" TEXT,
ADD COLUMN     "acceptedByUserAt" TIMESTAMP(3),
ADD COLUMN     "isAcceptedByTeacher" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAcceptedByUser" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_acceptedByTeacherId_fkey" FOREIGN KEY ("acceptedByTeacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
