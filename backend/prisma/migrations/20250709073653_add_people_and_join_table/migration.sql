/*
  Warnings:

  - The primary key for the `places` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "account_place" DROP CONSTRAINT "account_place_placeId_fkey";

-- AlterTable
ALTER TABLE "account_place" ALTER COLUMN "placeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "places" DROP CONSTRAINT "places_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "places_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "places_id_seq";

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_placements" (
    "id" SERIAL NOT NULL,
    "personId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "person_placements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "account_place" ADD CONSTRAINT "account_place_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_placements" ADD CONSTRAINT "person_placements_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_placements" ADD CONSTRAINT "person_placements_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
