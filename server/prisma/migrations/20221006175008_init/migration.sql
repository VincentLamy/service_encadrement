-- DropForeignKey
ALTER TABLE `Commentaire` DROP FOREIGN KEY `Commentaire_id_code_remarque_fkey`;

-- AlterTable
ALTER TABLE `Commentaire` MODIFY `id_code_remarque` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_id_code_remarque_fkey` FOREIGN KEY (`id_code_remarque`) REFERENCES `CodeRemarque`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
