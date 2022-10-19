/*
  Warnings:

  - A unique constraint covering the columns `[no_etudiant,id_code_remarque,titre,contenu,date_creation]` on the table `Commentaire` will be added. If there are existing duplicate values, this will fail.

*/

-- CreateIndex
CREATE UNIQUE INDEX `Commentaire_no_etudiant_id_code_remarque_titre_contenu_date__key` ON `Commentaire`(`no_etudiant`, `id_code_remarque`, `titre`, `contenu`, `date_creation`);
