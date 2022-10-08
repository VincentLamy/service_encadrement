/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `CodeRemarqueNoteFinale` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CodeRemarqueNoteFinale_nom_key` ON `CodeRemarqueNoteFinale`(`nom`);
