-- CreateTable
CREATE TABLE "CoupleAccount" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CLP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "partnerAId" TEXT NOT NULL,
    "partnerBId" TEXT,

    CONSTRAINT "CoupleAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoupleInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "coupleId" TEXT NOT NULL,

    CONSTRAINT "CoupleInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoupleAccount_partnerAId_key" ON "CoupleAccount"("partnerAId");

-- CreateIndex
CREATE UNIQUE INDEX "CoupleAccount_partnerBId_key" ON "CoupleAccount"("partnerBId");

-- CreateIndex
CREATE UNIQUE INDEX "CoupleInvite_token_key" ON "CoupleInvite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "CoupleInvite_coupleId_key" ON "CoupleInvite"("coupleId");

-- AddForeignKey
ALTER TABLE "CoupleAccount" ADD CONSTRAINT "CoupleAccount_partnerAId_fkey" FOREIGN KEY ("partnerAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoupleAccount" ADD CONSTRAINT "CoupleAccount_partnerBId_fkey" FOREIGN KEY ("partnerBId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoupleInvite" ADD CONSTRAINT "CoupleInvite_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "CoupleAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
