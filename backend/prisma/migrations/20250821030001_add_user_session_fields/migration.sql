/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."accounts" DROP COLUMN "refreshToken",
ADD COLUMN     "sessionExpiredAt" TIMESTAMP(3),
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "sessionIp" TEXT,
ADD COLUMN     "sessionRevokedAt" TIMESTAMP(3),
ADD COLUMN     "sessionUaHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_sessionId_key" ON "public"."accounts"("sessionId");
