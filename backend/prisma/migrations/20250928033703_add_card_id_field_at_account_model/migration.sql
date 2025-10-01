/*
  Warnings:

  - You are about to drop the column `cardId` on the `people` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cardId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."people_cardId_key";

-- AlterTable
ALTER TABLE "public"."accounts" ADD COLUMN     "cardId" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "surname" TEXT;

-- AlterTable
ALTER TABLE "public"."people" DROP COLUMN "cardId";

-- CreateIndex
CREATE UNIQUE INDEX "accounts_cardId_key" ON "public"."accounts"("cardId");
