/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `TypeEmploye` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex

SET FOREIGN_KEY_CHECKS=0;
CREATE UNIQUE INDEX `TypeEmploye_nom_key` ON `TypeEmploye`(`nom`);
SET FOREIGN_KEY_CHECKS=1;