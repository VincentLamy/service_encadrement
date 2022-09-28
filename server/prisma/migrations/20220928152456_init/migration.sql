/*
  Warnings:

  - A unique constraint covering the columns `[no_etudiant]` on the table `FormulaireMath` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `FormulaireMath_no_etudiant_key` ON `FormulaireMath`(`no_etudiant`);
