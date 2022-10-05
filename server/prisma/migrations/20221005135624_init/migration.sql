/*
  Warnings:

  - Added the required column `code` to the `CodeRemarque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable

SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE `coderemarque` ADD COLUMN `code` VARCHAR(255) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

SET FOREIGN_KEY_CHECKS = 1;
