-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(5) NOT NULL,

    UNIQUE INDEX `Session_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employe` (
    `no_employe` INTEGER NOT NULL AUTO_INCREMENT,
    `id_type_employe` INTEGER NOT NULL,
    `prenom` VARCHAR(64) NOT NULL,
    `nom` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `Employe_prenom_nom_key`(`prenom`, `nom`),
    PRIMARY KEY (`no_employe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeEmploye` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(64) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `TypeEmploye_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Groupe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_groupe` INTEGER NULL DEFAULT 0,
    `no_employe` INTEGER NULL,
    `code_cours` VARCHAR(18) NULL,
    `id_session` INTEGER NOT NULL,

    UNIQUE INDEX `Groupe_no_groupe_code_cours_id_session_key`(`no_groupe`, `code_cours`, `id_session`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_employe` INTEGER NOT NULL,
    `id_type_utilisateur` INTEGER NOT NULL,
    `courriel` VARCHAR(255) NOT NULL,
    `mdp` VARCHAR(255) NOT NULL,
    `sessions` VARCHAR(25) NOT NULL DEFAULT '',
    `date_activation` DATETIME(3) NOT NULL,
    `date_desactivation` DATETIME(3) NOT NULL,
    `actif` BOOLEAN NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `token_end_date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Utilisateur_no_employe_key`(`no_employe`),
    UNIQUE INDEX `Utilisateur_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeUtilisateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(64) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `TypeUtilisateur_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commentaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_etudiant` INTEGER NOT NULL,
    `no_employe` INTEGER NOT NULL,
    `id_groupe` INTEGER NOT NULL,
    `id_code_remarque` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(255) NOT NULL,
    `contenu` LONGTEXT NOT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Commentaire_no_etudiant_id_code_remarque_titre_date_creation_key`(`no_etudiant`, `id_code_remarque`, `titre`, `date_creation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodeRemarque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(12) NOT NULL,
    `nom` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `CodeRemarque_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cours` (
    `code` VARCHAR(18) NOT NULL,
    `nom` VARCHAR(64) NOT NULL,
    `id_campus` INTEGER NOT NULL,
    `duree` INTEGER NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ville` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `Campus_ville_key`(`ville`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TA_EtudiantGroupe` (
    `no_etudiant` INTEGER NOT NULL,
    `id_groupe` INTEGER NOT NULL,
    `id_code_remarque_note_finale` INTEGER NOT NULL,
    `note_ponderee` DOUBLE NOT NULL,
    `pourcentage_note_cumulee` DOUBLE NOT NULL,
    `duree_absence` DOUBLE NOT NULL,

    UNIQUE INDEX `TA_EtudiantGroupe_no_etudiant_id_groupe_key`(`no_etudiant`, `id_groupe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodeRemarqueNoteFinale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `CodeRemarqueNoteFinale_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etudiant` (
    `no_etudiant` INTEGER NOT NULL,
    `code_permanent` VARCHAR(12) NOT NULL,
    `prenom` VARCHAR(64) NOT NULL,
    `nom` VARCHAR(64) NOT NULL,
    `code_programme` VARCHAR(10) NOT NULL,
    `session_actuelle` INTEGER NOT NULL,
    `a_surveiller` BOOLEAN NOT NULL DEFAULT false,
    `date_dernier_telechargement` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `etat` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`no_etudiant`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TA_EtuStatut` (
    `id_statut_etudiant` INTEGER NOT NULL,
    `no_etudiant` INTEGER NOT NULL,

    UNIQUE INDEX `TA_EtuStatut_no_etudiant_id_statut_etudiant_key`(`no_etudiant`, `id_statut_etudiant`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StatutEtudiant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(16) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `StatutEtudiant_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Programme` (
    `code` VARCHAR(10) NOT NULL,
    `nom` VARCHAR(64) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormulaireMath` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heure_debut` DATETIME(3) NOT NULL,
    `heure_fin` DATETIME(3) NOT NULL,
    `effort_fourni` VARCHAR(255) NOT NULL,
    `experience_informatique` VARCHAR(255) NOT NULL,
    `no_etudiant` INTEGER NOT NULL,

    UNIQUE INDEX `FormulaireMath_no_etudiant_key`(`no_etudiant`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoursMath` (
    `id` SMALLINT NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(64) NOT NULL,
    `code` VARCHAR(10) NOT NULL,
    `annee` SMALLINT NOT NULL,

    UNIQUE INDEX `CoursMath_nom_annee_key`(`nom`, `annee`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TA_Math` (
    `id_cours_math` SMALLINT NOT NULL,
    `id_formulaire_math` INTEGER NOT NULL,
    `note_obtenue` VARCHAR(32) NOT NULL,

    UNIQUE INDEX `TA_Math_id_cours_math_id_formulaire_math_key`(`id_cours_math`, `id_formulaire_math`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pays` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `Pays_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Statut` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(64) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Statut_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TA_EtudiantPaysStatut` (
    `id_pays` INTEGER NOT NULL,
    `id_statut` INTEGER NOT NULL,
    `no_etudiant` INTEGER NOT NULL,

    UNIQUE INDEX `TA_EtudiantPaysStatut_id_pays_id_statut_no_etudiant_key`(`id_pays`, `id_statut`, `no_etudiant`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employe` ADD CONSTRAINT `Employe_id_type_employe_fkey` FOREIGN KEY (`id_type_employe`) REFERENCES `TypeEmploye`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Groupe` ADD CONSTRAINT `Groupe_no_employe_fkey` FOREIGN KEY (`no_employe`) REFERENCES `Employe`(`no_employe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Groupe` ADD CONSTRAINT `Groupe_code_cours_fkey` FOREIGN KEY (`code_cours`) REFERENCES `Cours`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Groupe` ADD CONSTRAINT `Groupe_id_session_fkey` FOREIGN KEY (`id_session`) REFERENCES `Session`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_no_employe_fkey` FOREIGN KEY (`no_employe`) REFERENCES `Employe`(`no_employe`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_id_type_utilisateur_fkey` FOREIGN KEY (`id_type_utilisateur`) REFERENCES `TypeUtilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_no_etudiant_fkey` FOREIGN KEY (`no_etudiant`) REFERENCES `Etudiant`(`no_etudiant`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_no_employe_fkey` FOREIGN KEY (`no_employe`) REFERENCES `Employe`(`no_employe`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_id_groupe_fkey` FOREIGN KEY (`id_groupe`) REFERENCES `Groupe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_id_code_remarque_fkey` FOREIGN KEY (`id_code_remarque`) REFERENCES `CodeRemarque`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cours` ADD CONSTRAINT `Cours_id_campus_fkey` FOREIGN KEY (`id_campus`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_EtudiantGroupe` ADD CONSTRAINT `TA_EtudiantGroupe_no_etudiant_fkey` FOREIGN KEY (`no_etudiant`) REFERENCES `Etudiant`(`no_etudiant`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_EtudiantGroupe` ADD CONSTRAINT `TA_EtudiantGroupe_id_groupe_fkey` FOREIGN KEY (`id_groupe`) REFERENCES `Groupe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_EtudiantGroupe` ADD CONSTRAINT `TA_EtudiantGroupe_id_code_remarque_note_finale_fkey` FOREIGN KEY (`id_code_remarque_note_finale`) REFERENCES `CodeRemarqueNoteFinale`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Etudiant` ADD CONSTRAINT `Etudiant_code_programme_fkey` FOREIGN KEY (`code_programme`) REFERENCES `Programme`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_EtuStatut` ADD CONSTRAINT `TA_EtuStatut_id_statut_etudiant_fkey` FOREIGN KEY (`id_statut_etudiant`) REFERENCES `StatutEtudiant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_EtuStatut` ADD CONSTRAINT `TA_EtuStatut_no_etudiant_fkey` FOREIGN KEY (`no_etudiant`) REFERENCES `Etudiant`(`no_etudiant`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FormulaireMath` ADD CONSTRAINT `FormulaireMath_no_etudiant_fkey` FOREIGN KEY (`no_etudiant`) REFERENCES `Etudiant`(`no_etudiant`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_Math` ADD CONSTRAINT `TA_Math_id_cours_math_fkey` FOREIGN KEY (`id_cours_math`) REFERENCES `CoursMath`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_Math` ADD CONSTRAINT `TA_Math_id_formulaire_math_fkey` FOREIGN KEY (`id_formulaire_math`) REFERENCES `FormulaireMath`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_EtudiantPaysStatut` ADD CONSTRAINT `TA_EtudiantPaysStatut_id_pays_fkey` FOREIGN KEY (`id_pays`) REFERENCES `Pays`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_EtudiantPaysStatut` ADD CONSTRAINT `TA_EtudiantPaysStatut_id_statut_fkey` FOREIGN KEY (`id_statut`) REFERENCES `Statut`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TA_EtudiantPaysStatut` ADD CONSTRAINT `TA_EtudiantPaysStatut_no_etudiant_fkey` FOREIGN KEY (`no_etudiant`) REFERENCES `Etudiant`(`no_etudiant`) ON DELETE CASCADE ON UPDATE CASCADE;
