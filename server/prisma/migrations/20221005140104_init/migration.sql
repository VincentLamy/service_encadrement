/*
  Warnings:

  - You are about to alter the column `code` on the `coderemarque` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(12)`.

*/
-- AlterTable
ALTER TABLE `coderemarque` MODIFY `nom` VARCHAR(255) NOT NULL,
    MODIFY `code` VARCHAR(12) NOT NULL;
