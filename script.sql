/* Fonctionne seulement quand la bd est vide
que aucune importation de CSV à été effectuer */

DELETE FROM `session`;
DELETE FROM `campus`;
DELETE FROM `utilisateur`;
DELETE FROM `employe`;
DELETE FROM `typeemploye`;
DELETE FROM `typeutilisateur`;
DELETE FROM `coderemarque`;
DELETE FROM `cours`;

INSERT INTO `session` (`code`) 
VALUES ('AUT21'),
	   ('HIV22'),
       ('ETE22'),
	   ('AUT22');

INSERT INTO `campus`(`ville`)
VALUES ('Sherbrooke');

INSERT INTO `typeemploye`(`nom`, `description`)
VALUES ('Enseignant','Ceci est un enseignant'),
	   ("Responsable d'encadrement", "Ceci est un responsable d\'encadrement");
	
INSERT INTO `typeutilisateur`(`nom`, `description`)
VALUES ('Administrateur', 'Ceci est un administrateur'),
	   ('Responsable', 'Ceci est un responsable');
	   
INSERT INTO `employe`(`id_type_employe`, `prenom`, `nom`)
VALUES ((SELECT id FROM typeemploye WHERE nom = "Responsable d'encadrement"), 'Jocelyn', 'Lapalme');

-- Changer le no-employe selon la bd
INSERT INTO `utilisateur`(`no_employe`, `id_type_utilisateur`, `courriel`, `mdp`, `sessions`,`date_activation`, `date_desactivation`, `actif`, `token`, `token_end_date`)
VALUES ((SELECT no_employe FROM employe WHERE nom = "admin"),(SELECT id FROM typeutilisateur WHERE nom = "Administrateur"), 'Jocelyn.Lapalme@cegepsherbrooke.qc.ca', '6239b479b97a15a5a494351afcc22b5b85627f37250649713c0d6f4d1d10100a','1,2,3,4,5,6', CURRENT_TIMESTAMP() , CURRENT_TIMESTAMP(),'1', 'b', CURRENT_TIMESTAMP());

INSERT INTO `coderemarque`(`code`, `nom`)
VALUES ("1", "Arrive souvent en retard"),
	   ("2", "Dort en classe" ),
	   ("3", "N\'a pas le matériel requis pour le cours ou le laboratoire"),
	   ("4", "Quitte souvent avant la fin des cours"),
	   ("5", "Isolé en classe"),
	   ("6", "Facilement distrait, inattentif"),
	   ("7", "Enclin au bavardage"),
	   ("8", "Utilise son cellulaire en classe"),
	   ("9", "Prend plus de temps que les autres pour faire ses travaux et évaluations"),
	   ("20", "Travail remis en retard"),
	   ("21", "Travail non remis"),
	   ("22", "Ne lit pas ses MIO"),
	   ("23",  "Ne fait pas les travaux ou exercices demandés"),
	   ("24", "Travail partiellement accompli"),
	   ("25", "Participe peu ou pas aux activités d'apprentissage"),
	   ("30", "Demande à l'enseignant ou à l'enseignante de faire seul un travail d'équipe"),
	   ("31", "Difficulté à se trouver une équipe de travail"),
	   ("40", "A demandé une évaluation différée sans raison valable"),
	   ("41", "Absent à une évaluation sans raison valable"),
	   ("42", "N'a pas terminé l'évaluation"),
	   ("AUTN", "Autre (maximum de 3000 caractères):"),
	   ("PROG", "Progression"),
	   ("CHAN", "Chances de réussite ");

SET @CampusID = (SELECT c.id FROM campus c WHERE c.ville = 'Sherbrooke'); 

INSERT INTO `cours`(`code`, `nom`, `id_campus`, `duree`)
VALUES ("365-HCY-SH","Initiation à la relation d'aide en informatique",@CampusID,null),
	   ("420-103-SH","Exploitation des technologies collaboratives",@CampusID,null),
	   ("420-123-SH","Création de pages Web",@CampusID,null),
	   ("420-135-SH","Introduction à la programmation",@CampusID,null),
	   ("420-146-SH","Initiation à la gestion d'un ordinateur",@CampusID,null),
	   ("420-IEI-SH","Cours international",@CampusID,null),
	   ("420-243-SH","Administration d'une station de travail",@CampusID,null),
	   ("420-254-SH","Traitement de données",@CampusID,null),
	   ("420-266-SH","Programmation orientée objet",@CampusID,null),
	   ("420-275-SH","Implantation de réseaux locaux",@CampusID,null),
	   ("420-316-SH","Structures de données dans les jeux",@CampusID,null),
	   ("420-395-SH","Développement Web",@CampusID,null),
	   ("420-384-SH","Exploitation de bases de données",@CampusID,null),
	   ("420-334-SH","Intro à la sécurité informatique",@CampusID,null),
	   ("420-323-SH","Évaluation des composants infos",@CampusID,null),
	   ("420-356-SH","Administration de serveurs Windows",@CampusID,null),
	   ("420-346-SH","Administration de serveurs Linux",@CampusID,null),
	   ("420-404-SH","Méthodologie du dév. logiciel",@CampusID,null),
	   ("420-456-SH","Dév. Web avancé",@CampusID,null),
	   ("420-446-SH","Dév. d'apps mobiles",@CampusID,null),
	   ("420-473-SH","Dév. d'apps avec des objets connectés",@CampusID,null),
	   ("420-443-SH","Surveillance d'un réseau",@CampusID,null),
	   ("420-436-SH","Développement de scripts",@CampusID,null),
	   ("420-426-SH","Déploiement réseaux interconnectés",@CampusID,null),
	   ("420-564-SH","Exploration de nouvelles technologies.",@CampusID,null),
	   ("420-510-SH","Projet de développement d’applications",@CampusID,null),
	   ("420-511-SH","Projet d’implantation de réseaux",@CampusID,null),
	   ("420-513-SH","Préparation stage info.",@CampusID,null);