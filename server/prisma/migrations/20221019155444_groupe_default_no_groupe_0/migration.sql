-- AlterTable
ALTER TABLE `commentaire` ALTER COLUMN `id_groupe` DROP DEFAULT;

-- AlterTable
ALTER TABLE `groupe` MODIFY `no_groupe` INTEGER NULL DEFAULT 0;
