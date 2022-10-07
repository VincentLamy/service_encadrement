/*
  Warnings:

  - A unique constraint covering the columns `[prenom,nom]` on the table `Employe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Employe_prenom_nom_key` ON `Employe`(`prenom`, `nom`);
