/*
  Warnings:

  - The primary key for the `Pays` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Pays` table. All the data in the column will be lost.
  - You are about to drop the column `code_pays` on the `TA_EtudiantPaysStatut` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nom]` on the table `Pays` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_pays,id_statut,no_etudiant]` on the table `TA_EtudiantPaysStatut` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Pays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_pays` to the `TA_EtudiantPaysStatut` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TA_EtudiantPaysStatut` DROP FOREIGN KEY `TA_EtudiantPaysStatut_code_pays_fkey`;

-- DropIndex
DROP INDEX `TA_EtudiantPaysStatut_code_pays_id_statut_no_etudiant_key` ON `TA_EtudiantPaysStatut`;

-- AlterTable
ALTER TABLE `Pays` DROP PRIMARY KEY,
    DROP COLUMN `code`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TA_EtudiantPaysStatut` DROP COLUMN `code_pays`,
    ADD COLUMN `id_pays` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pays_nom_key` ON `Pays`(`nom`);

-- CreateIndex
CREATE UNIQUE INDEX `TA_EtudiantPaysStatut_id_pays_id_statut_no_etudiant_key` ON `TA_EtudiantPaysStatut`(`id_pays`, `id_statut`, `no_etudiant`);

-- AddForeignKey
ALTER TABLE `TA_EtudiantPaysStatut` ADD CONSTRAINT `TA_EtudiantPaysStatut_id_pays_fkey` FOREIGN KEY (`id_pays`) REFERENCES `Pays`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
