/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."accounts" ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_refreshToken_key" ON "public"."accounts"("refreshToken");
