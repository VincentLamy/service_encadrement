/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Statut` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Statut_nom_key` ON `Statut`(`nom`);
