/*
  Warnings:

  - You are about to drop the column `partnerAId` on the `CoupleAccount` table. All the data in the column will be lost.
  - You are about to drop the column `partnerBId` on the `CoupleAccount` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `CoupleAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CoupleAccount" DROP CONSTRAINT "CoupleAccount_partnerAId_fkey";

-- DropForeignKey
ALTER TABLE "CoupleAccount" DROP CONSTRAINT "CoupleAccount_partnerBId_fkey";

-- DropIndex
DROP INDEX "CoupleAccount_partnerAId_key";

-- DropIndex
DROP INDEX "CoupleAccount_partnerBId_key";

-- AlterTable
ALTER TABLE "CoupleAccount" DROP COLUMN "partnerAId",
DROP COLUMN "partnerBId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "invitedId" TEXT;

-- CreateIndex
CREATE INDEX "CoupleAccount_creatorId_idx" ON "CoupleAccount"("creatorId");

-- CreateIndex
CREATE INDEX "CoupleAccount_invitedId_idx" ON "CoupleAccount"("invitedId");

-- AddForeignKey
ALTER TABLE "CoupleAccount" ADD CONSTRAINT "CoupleAccount_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoupleAccount" ADD CONSTRAINT "CoupleAccount_invitedId_fkey" FOREIGN KEY ("invitedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
