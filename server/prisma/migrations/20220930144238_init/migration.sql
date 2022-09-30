/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Groupe` table. All the data in the column will be lost.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[no_groupe,code_session]` on the table `Groupe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code_session` to the `Groupe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Groupe` DROP FOREIGN KEY `Groupe_sessionId_fkey`;

-- AlterTable
ALTER TABLE `Groupe` DROP COLUMN `sessionId`,
    ADD COLUMN `code_session` VARCHAR(5) NOT NULL;

-- AlterTable
ALTER TABLE `Session` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Groupe_no_groupe_code_session_key` ON `Groupe`(`no_groupe`, `code_session`);

-- AddForeignKey
ALTER TABLE `Groupe` ADD CONSTRAINT `Groupe_code_session_fkey` FOREIGN KEY (`code_session`) REFERENCES `Session`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
