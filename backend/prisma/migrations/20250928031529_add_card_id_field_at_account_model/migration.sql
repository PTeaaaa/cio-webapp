/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `people` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cardId]` on the table `people` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."people_name_trgm_idx";

-- DropIndex
DROP INDEX "public"."people_surname_trgm_idx";

-- DropIndex
DROP INDEX "public"."places_name_trgm_idx";

-- AlterTable
ALTER TABLE "public"."accounts" ALTER COLUMN "rememberMeSession" DROP NOT NULL,
ALTER COLUMN "rememberMeSession" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."people" ADD COLUMN     "cardId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "people_id_key" ON "public"."people"("id");

-- CreateIndex
CREATE UNIQUE INDEX "people_cardId_key" ON "public"."people"("cardId");
