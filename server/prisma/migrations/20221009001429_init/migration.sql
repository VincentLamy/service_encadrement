-- DropIndex
DROP INDEX `Groupe_code_session_fkey` ON `Groupe`;

-- AddForeignKey
ALTER TABLE `Groupe` ADD CONSTRAINT `Groupe_code_session_fkey` FOREIGN KEY (`code_session`) REFERENCES `Session`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
