/*
  Warnings:

  - A unique constraint covering the columns `[no_etudiant,id_code_remarque,date_creation]` on the table `Commentaire` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Commentaire_date_creation_key` ON `Commentaire`;

-- CreateIndex
CREATE UNIQUE INDEX `Commentaire_no_etudiant_id_code_remarque_date_creation_key` ON `Commentaire`(`no_etudiant`, `id_code_remarque`, `date_creation`);
