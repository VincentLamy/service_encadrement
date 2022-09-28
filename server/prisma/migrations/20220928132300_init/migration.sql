/*
  Warnings:

  - A unique constraint covering the columns `[ville]` on the table `Campus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Campus_ville_key` ON `Campus`(`ville`);
