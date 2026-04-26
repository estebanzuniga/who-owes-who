-- DropForeignKey
ALTER TABLE "CoupleInvite" DROP CONSTRAINT "CoupleInvite_coupleId_fkey";

-- AddForeignKey
ALTER TABLE "CoupleInvite" ADD CONSTRAINT "CoupleInvite_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "CoupleAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
