/*
  Warnings:

  - You are about to drop the column `id_type_remarque` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the `TypeRemarque` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Commentaire` DROP FOREIGN KEY `Commentaire_id_type_remarque_fkey`;

-- AlterTable
ALTER TABLE `Commentaire` DROP COLUMN `id_type_remarque`;

-- DropTable
DROP TABLE `TypeRemarque`;
