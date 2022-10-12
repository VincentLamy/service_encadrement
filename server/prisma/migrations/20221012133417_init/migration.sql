/*
  Warnings:

  - A unique constraint covering the columns `[no_groupe,code_cours,code_session]` on the table `Groupe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Groupe_no_groupe_code_session_key` ON `Groupe`;

-- CreateIndex
CREATE UNIQUE INDEX `Groupe_no_groupe_code_cours_code_session_key` ON `Groupe`(`no_groupe`, `code_cours`, `code_session`);
