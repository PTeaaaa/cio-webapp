/*
  Warnings:

  - A unique constraint covering the columns `[accountId,placeId]` on the table `account_place` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,surname,year]` on the table `people` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "account_place_accountId_placeId_key" ON "account_place"("accountId", "placeId");

-- CreateIndex
CREATE UNIQUE INDEX "people_name_surname_year_key" ON "people"("name", "surname", "year");
