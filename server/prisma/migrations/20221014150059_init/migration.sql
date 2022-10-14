/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `TypeUtilisateur` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TypeUtilisateur_nom_key` ON `TypeUtilisateur`(`nom`);
