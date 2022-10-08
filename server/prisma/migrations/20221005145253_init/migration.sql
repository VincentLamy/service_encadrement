/*
  Warnings:

  - A unique constraint covering the columns `[date_creation]` on the table `Commentaire` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Commentaire_date_creation_key` ON `Commentaire`(`date_creation`);
