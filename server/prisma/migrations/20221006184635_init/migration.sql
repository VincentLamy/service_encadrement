/*
  Warnings:

  - You are about to alter the column `code` on the `StatutEtudiant` table. The data in that column could be lost. The data in that column will be cast from `VarChar(64)` to `VarChar(16)`.

*/
-- AlterTable
ALTER TABLE `StatutEtudiant` MODIFY `code` VARCHAR(16) NOT NULL;
