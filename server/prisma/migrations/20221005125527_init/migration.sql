/*
  Warnings:

  - You are about to alter the column `note_obtenue` on the `TA_Math` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(32)`.

*/
-- AlterTable
ALTER TABLE `TA_Math` MODIFY `note_obtenue` VARCHAR(32) NOT NULL;
