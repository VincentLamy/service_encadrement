/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `CoursMath` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CoursMath_nom_key` ON `CoursMath`(`nom`);
