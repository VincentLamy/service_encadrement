/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `StatutEtudiant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `StatutEtudiant_code_key` ON `StatutEtudiant`(`code`);
