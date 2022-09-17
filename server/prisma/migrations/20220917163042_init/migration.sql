/*
  Warnings:

  - You are about to drop the column `ville` on the `Session` table. All the data in the column will be lost.
  - Added the required column `code` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Session` DROP COLUMN `ville`,
    ADD COLUMN `code` VARCHAR(5) NOT NULL;
