-- DropForeignKey
ALTER TABLE `groupe` DROP FOREIGN KEY `Groupe_code_cours_fkey`;

-- DropForeignKey
ALTER TABLE `groupe` DROP FOREIGN KEY `Groupe_no_employe_fkey`;

-- AlterTable
ALTER TABLE `groupe` MODIFY `no_employe` INTEGER NULL,
    MODIFY `code_cours` VARCHAR(10) NULL;

-- AddForeignKey
ALTER TABLE `Groupe` ADD CONSTRAINT `Groupe_no_employe_fkey` FOREIGN KEY (`no_employe`) REFERENCES `Employe`(`no_employe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Groupe` ADD CONSTRAINT `Groupe_code_cours_fkey` FOREIGN KEY (`code_cours`) REFERENCES `Cours`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
