-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_no_etudiant_fkey` FOREIGN KEY (`no_etudiant`) REFERENCES `Etudiant`(`no_etudiant`) ON DELETE RESTRICT ON UPDATE CASCADE;
