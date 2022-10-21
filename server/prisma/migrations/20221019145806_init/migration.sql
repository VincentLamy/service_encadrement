/*
  Warnings:

  - A unique constraint covering the columns `[no_employe]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Utilisateur_no_employe_key` ON `Utilisateur`(`no_employe`);
