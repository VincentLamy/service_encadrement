/*
  Warnings:

  - A unique constraint covering the columns `[nom,annee]` on the table `CoursMath` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `CoursMath_nom_code_key` ON `CoursMath`;

-- CreateIndex
CREATE UNIQUE INDEX `CoursMath_nom_annee_key` ON `CoursMath`(`nom`, `annee`);
