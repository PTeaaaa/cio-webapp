/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `places` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "places_name_key" ON "places"("name");
