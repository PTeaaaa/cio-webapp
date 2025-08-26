/*
  Warnings:

  - Added the required column `department` to the `people` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `people` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `people` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agency` to the `places` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "people" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "placeId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "prefix" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;

-- AlterTable
ALTER TABLE "places" ADD COLUMN     "agency" TEXT NOT NULL;
