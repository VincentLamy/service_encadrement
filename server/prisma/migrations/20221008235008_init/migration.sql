/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Groupe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[no_groupe,id_session]` on the table `Groupe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_session` to the `Groupe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Groupe` DROP FOREIGN KEY `Groupe_code_session_fkey`;