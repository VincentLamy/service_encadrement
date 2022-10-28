/*
  Warnings:

  - A unique constraint covering the columns `[courriel]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `utilisateur` MODIFY `date_activation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Utilisateur_courriel_key` ON `Utilisateur`(`courriel`);
