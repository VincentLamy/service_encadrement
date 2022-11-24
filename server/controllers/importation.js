const { PrismaClient } = require('@prisma/client');
const e = require('express');
const { stat } = require('fs');
const { Session } = require('inspector');

const prisma = new PrismaClient();
const jwtVerification = require('../modules/jwt_verification');

module.exports = class Importation {
    static async addOneRapportEncadrement(req, res) {
        try {
            if (jwtVerification(req.token) === false) {
                res.status(403).json();
                return;
            }

            const file_line = req.body;

            // Verifications
            if (
            file_line['Nom de l\'enseignant'] === "" ||
            file_line['Numéro de dossier'] === "" ||
            file_line['Code permanent'] === "" ||
            file_line['Nom de l\'étudiant'] === "" ||
            file_line['Session du programme d\'études'] === "" ||
            file_line['Numéro du cours'] === "" ||
            file_line['Numéro du groupe'] === "" ||
            file_line['Nb heures d\'abscenses'] === "" ||
            file_line['Nom de l\'enseignant'] === "" ||
            file_line['Nb heures du cours'] === "" ||
            file_line['Campus'] === "") {
                res.status(201).json({ ok: "true", bypassed: "true", message: 'La ligne du rapport d\'encadrement n\'a pas été ajoutée' });
                return;
            }

            // Traitement session
            let codeSession = "";

            const today = new Date();

            const yy = today.getFullYear().toString().substring(2);
            const mm = today.getMonth() + 1;
            const dd = today.getDate();

            // AUT
            if ((mm == 8 && dd >= 1 || mm > 8) && (mm == 12 && dd <= 31 || mm < 12)) {
                codeSession = "AUT" + yy;
            }

            // HIV
            if ((mm == 1 && dd >= 1 || mm > 1) && (mm == 5 && dd <= 19 || mm < 5)) {
                codeSession = "HIV" + yy;
            }

            // ETE
            if ((mm == 5 && dd >= 20 || mm > 5) && (mm == 7 && dd <= 31 || mm < 7)) {
                codeSession = "ETE" + yy;
            }

            //Insert Session
            const session = await prisma.session.upsert({
                where: { code: codeSession || '' },
                update: {},
                create: {
                    code: codeSession,
                },
            });

            // Insert Programme
            const programme = await prisma.programme.upsert({
                where: { code: file_line['Numéro du programme'] || 0 },
                update: {},
                create: {
                    code: String(file_line['Numéro du programme']),
                    nom: '',
                    description: '',
                },
            });
  
            // Split Etudiant name
            const nomEtudiant = file_line['Nom de l\'étudiant'].split(',');
  
            // Insert Etudiant
            const etudiant = await prisma.etudiant.upsert({
                where: { no_etudiant: Number(file_line['Numéro de dossier']) || 0 },
                update: {
                    no_etudiant: Number(file_line['Numéro de dossier']),
                    code_permanent: file_line['Code permanent'],
                    nom: nomEtudiant[0],
                    prenom: nomEtudiant[1],
                    session_actuelle: Number(file_line['Session du programme d\'études']),
                    code_programme: programme.code,
                    a_surveiller: false,
                    etat: true,
                    date_dernier_telechargement: new Date(),
                },
                create: {
                    no_etudiant: Number(file_line['Numéro de dossier']),
                    code_permanent: file_line['Code permanent'],
                    nom: nomEtudiant[0],
                    prenom: nomEtudiant[1],
                    session_actuelle: Number(file_line['Session du programme d\'études']),
                    code_programme: programme.code,
                    a_surveiller: false,
                    etat: true,
                    date_dernier_telechargement: new Date(),
                },
            });
  
            // Insert Campus
            const campus = await prisma.campus.upsert({
                where: { ville: file_line['Campus'] || '' },
                update: {},
                create: {
                    ville: file_line['Campus'],
                },
            });
  
            // Insert Cours
            const cours = await prisma.cours.upsert({
                where: { code: file_line['Numéro du cours'] || 0 },
                update: {
                    duree: Number(file_line['Nb heures du cours']),
                },
                create: {
                    code: file_line['Numéro du cours'],
                    nom: '',
                    duree: Number(file_line['Nb heures du cours']),
                    id_campus: campus.id,
                },
            });

            // Split Enseignant name
            const nomEnseignant = file_line['Nom de l\'enseignant'].split(',');

            const id_type_employe = await prisma.typeEmploye.findUnique({
                where: {
                  nom: "Enseignant",
                },
                select: {
                  id: true,
                },
              });
  
            // Insert Enseignant
            const employe = await prisma.employe.upsert({
                where: {
                    prenom_nom: {
                        nom: nomEnseignant[0] || '',
                        prenom: nomEnseignant[1] || '',
                    }
                },
                update: {},
                create: {
                    id_type_employe: id_type_employe.id,
                    nom: nomEnseignant[0],
                    prenom: nomEnseignant[1],
                },
            });
  
            // Insert Groupe
            const groupe = await prisma.groupe.upsert({
                where: {
                    no_groupe_code_cours_code_session: {
                        no_groupe: Number(file_line['Numéro du groupe']) || 0,
                        code_cours: cours.code,
                        code_session: session.code || 0,
                    }
                },
                update: {},
                create: {
                    no_groupe: Number(file_line['Numéro du groupe']),
                    code_cours: cours.code,
                    code_session: session.code,
                    no_employe: employe.no_employe,
                },
            });
  
            // Insert Code Remarque
            const codeRemarqueNoteFinale = await prisma.codeRemarqueNoteFinale.upsert({
                where: { nom: file_line['Code de remarque de la note finale'] || '' },
                update: {},
                create: {
                    nom: file_line['Code de remarque de la note finale'],
                },
            });
  
            // Insert TA Etudiant Groupe
            const TAEtudiantGroupe = await prisma.tA_EtudiantGroupe.upsert({
                where: {
                    no_etudiant_id_groupe: {
                        no_etudiant: etudiant.no_etudiant || 0,
                        id_groupe: groupe.id || 0,
                    }
                },
                update: {
                    no_etudiant: etudiant.no_etudiant,
                    id_groupe: groupe.id,
                    id_code_remarque_note_finale: codeRemarqueNoteFinale.id,
                    note_ponderee: parseFloat(file_line['Note Pondérée']) || 0,
                    pourcentage_note_cumulee: parseFloat(file_line['Pourcentage note cumulée']) || 0,
                    duree_absence: parseFloat(file_line['Nb heures d\'absences']) || 0,
                },
                create: {
                    no_etudiant: etudiant.no_etudiant,
                    id_groupe: groupe.id,
                    id_code_remarque_note_finale: codeRemarqueNoteFinale.id,
                    note_ponderee: parseFloat(file_line['Note Pondérée']) || 0,
                    pourcentage_note_cumulee: parseFloat(file_line['Pourcentage note cumulée']) || 0,
                    duree_absence: parseFloat(file_line['Nb heures d\'absences']) || 0,
                },
            });
  
            if (file_line['Date de saisie de la remarque']) {
                // Traitement des remarques
                let titre = "";
                let contenu = "";
  
                if (file_line['Type de remarque'] === "Remarque") {
                    titre = file_line['Description de la remarque'];
                    contenu = file_line['Commentaire'];
                }
                else if (file_line['Type de remarque'] === "Chances de réussite") {
                    titre = "Autre";
                    contenu = file_line['Description de la remarque'];
                }
                else if (file_line['Type de remarque'] == "4") {
                    titre = "Progression";
  
                    if (file_line['Description de la remarque'] == "0") {
                        contenu = "Non applicable";
                    }
                    else if (file_line['Description de la remarque'] == "1") {
                        contenu = "Faibles";
                    }
                    else if (file_line['Description de la remarque'] == "2") {
                        contenu = "Moyennes";
                    }
                    else if (file_line['Description de la remarque'] == "3") {
                        contenu = "Bonnes";
                    }
                    else if (file_line['Description de la remarque'] == "4") {
                        contenu = "Très bonnes";
                    }
                }
                else if (file_line['Type de remarque'] == "5") {
                    titre = "Chances de réussite";
  
                    if (file_line['Description de la remarque'] == "0") {
                        contenu = "Non applicable";
                    }
                    else if (file_line['Description de la remarque'] == "1") {
                        contenu = "Faibles";
                    }
                    else if (file_line['Description de la remarque'] == "2") {
                        contenu = "Moyennes";
                    }
                    else if (file_line['Description de la remarque'] == "3") {
                        contenu = "Bonnes";
                    }
                    else if (file_line['Description de la remarque'] == "4") {
                        contenu = "Très bonnes";
                    }
                }
            
                if (file_line['Commentaire'] && (file_line['Type de remarque'] == "4" || file_line['Type de remarque'] == "5")) {
                    contenu += " - " + file_line['Commentaire'];
                }
  
                // Insert Commentaire
                const commentaire = await prisma.commentaire.upsert({
                    where: {
                        no_etudiant_id_code_remarque_titre_date_creation: {
                            no_etudiant: etudiant.no_etudiant || 0,
                            id_code_remarque: String(file_line['Code de la remarque']) || "",
                            titre: titre,
                            date_creation: excelDateToJSDate(file_line['Date de saisie de la remarque']) || 0,
                        }
                    },
                    update: {},
                    create: {
                        no_etudiant: etudiant.no_etudiant,
                        no_employe: employe.no_employe,
                        id_groupe: groupe.id,
                        id_code_remarque: String(file_line['Code de la remarque']) || 0,
                        date_creation: excelDateToJSDate(file_line['Date de saisie de la remarque']) || 0,
                        titre: titre,
                        contenu: contenu,
                    },
                });
            }
  
            // Traitement Statut Etudiant Cours
            let statutEtuCours = file_line['StatutEtuCours'];
            statutEtuCours = statutEtuCours.replace(/\s/g, ''); // Deleting spaces
  
            statutEtuCours = statutEtuCours.split(';'); // Splitting by ;
  
            for (let j = 0; j < statutEtuCours.length; j++) {
                if (statutEtuCours[j]) {
                    // Insert Statut Etudiant
                    const statutEtudiant = await prisma.statutEtudiant.upsert({
                        where: { code: statutEtuCours[j] || '' },
                        update: {},
                        create: {
                            code: statutEtuCours[j],
                            description: '',
                        },
                    });
  
                    // Insert TA Etu Statut
                    const TAEtuStatut = await prisma.tA_EtuStatut.upsert({
                        where: {
                            no_etudiant_id_statut_etudiant: {
                                no_etudiant: etudiant.no_etudiant || 0,
                                id_statut_etudiant: statutEtudiant.id || 0,
                            },
                        },
                        update: {},
                        create: {
                            no_etudiant: etudiant.no_etudiant,
                            id_statut_etudiant: statutEtudiant.id,
                        },
                    });
                }
            }
            res.status(201).json({ ok: "true", bypassed: "false", message: 'La ligne du rapport d\'encadrement a été ajouté avec succès' });
        } catch (err) {
            res.status(400).json({ ok: "false", message: 'Un problème est survenu lors de l\'importation du rapport d\'encadrement' });
        }
    };

    static async addOneSondageMathematiques(req, res) {
        try {
            if (jwtVerification(req.token) === false) {
                res.status(403).json();
                return;
            }

            const file_line = req.body;

            const noEtudiant = file_line['Adresse de messagerie'].split('@');

            const etudiant_exist = await prisma.etudiant.findUnique({
                where: {
                  no_etudiant: Number(noEtudiant[0]),
                },
                select: {
                  no_etudiant: true,
                },
              });

            if(!etudiant_exist) {
                res.status(201).json({ ok: "true", bypassed: "true", message: 'La ligne sondage mathématique n\'a pas été ajoutée' });
                return;
            }

            // Insert Cours Math 4
            const coursMath4 = await prisma.coursMath.upsert({
                where: {
                    nom_annee: {
                        nom: file_line['Le cours de mathématiques que vous avez suivi en secondaire 4 ?'],
                        annee: 4,
                    }
                },
                update: {},
                create: {
                    nom: file_line['Le cours de mathématiques que vous avez suivi en secondaire 4 ?'],
                    annee: 4,
                    code: "",
                },
            });
    
            // Insert Cours Math 5
            const coursMath5 = await prisma.coursMath.upsert({
                where: {
                    nom_annee: {
                        nom: file_line['Le cours de mathématiques que vous avez suivi en secondaire 5 ?'],
                        annee: 5,
                    }
                },
                update: {},
                create: {
                    nom: file_line['Le cours de mathématiques que vous avez suivi en secondaire 5 ?'],
                    annee: 5,
                    code: "",
                },
            });
    
            // Insert Formulaire Math
            
    
            let experienceInformatique = file_line['Indiquer votre expérience en informatique avant le Cégep (pas juste effleuré la chose) ?'];
    
            const formulaireMath = await prisma.formulaireMath.upsert({
                where: { no_etudiant: Number(noEtudiant[0]) || 0 },
                update: {},
                create: {
                    heure_debut: excelDateToJSDate(file_line['Heure de début']),
                    heure_fin: excelDateToJSDate(file_line['Heure de fin']),
                    effort_fourni: file_line['L\'effort fourni au secondaire pour réussir ?'],
                    experience_informatique: experienceInformatique,
                    no_etudiant: Number(noEtudiant[0]),
                },
            });
    
            // Insert TA Math 4
            const TAMath4 = await prisma.tA_Math.upsert({
                where: {
                    id_cours_math_id_formulaire_math: {
                        id_cours_math: coursMath4.id || 0,
                        id_formulaire_math: formulaireMath.id || 0,
                    },
                },
                update: {},
                create: {
                    id_cours_math: coursMath4.id,
                    id_formulaire_math: formulaireMath.id,
                    note_obtenue: file_line['La note obtenue pour le cours de mathématiques que vous avez suivi en secondaire 4 ?'],
                },
            });
    
            // Insert TA Math 5
            const TAMath5 = await prisma.tA_Math.upsert({
                where: {
                    id_cours_math_id_formulaire_math: {
                        id_cours_math: coursMath5.id || 0,
                        id_formulaire_math: formulaireMath.id || 0,
                    },
                },
                update: {},
                create: {
                    id_cours_math: coursMath5.id,
                    id_formulaire_math: formulaireMath.id,
                    note_obtenue: file_line['La note obtenue pour le cours de mathématiques que vous avez suivi en secondaire 5 ?'],
                },
            });
      
            res.status(201).json({ ok: "true", message: 'La ligne du sondage de mathématiques a été ajouté avec succès' });
        } catch (err) {
            res.status(400).json({ ok: "false", message: 'Un problème est survenu lors de l\'importation du sondage de mathématiques' });
        }
      };
      
    static async addOneEtudiantsInternationaux(req, res) {
        try {
            if (jwtVerification(req.token) === false) {
                res.status(403).json();
                return;
            }

            const file_line = req.body;


            const etudiant_exist = await prisma.etudiant.findUnique({
                where: {
                  no_etudiant: Number(file_line['Numero d\'étudiant']),
                },
                select: {
                  no_etudiant: true,
                },
              });

            if(!etudiant_exist) {
                res.status(201).json({ ok: "true", bypassed: "true", message: 'La ligne d\'étudiant international n\'a pas été ajoutée' });
                return;
            }
                
            // Insert Pays
            const pays = await prisma.pays.upsert({
                where: { nom: file_line['Pays d\'origine'] || '' },
                update: {},
                create: {
                    nom: file_line['Pays d\'origine'],
                },
            });
    
            // Insert Statut
            const statut = await prisma.statut.upsert({
                where: { nom: file_line['Statut'] || '' },
                update: {},
                create: {
                    nom: file_line['Statut'],
                    description: '',
                },
            });
    
            // Insert TA Etudiant Pays Statut
            const TAEtudiantPaysStatut = await prisma.tA_EtudiantPaysStatut.upsert({
                where: {
                    id_pays_id_statut_no_etudiant: {
                        id_pays: pays.id || 0,
                        id_statut: statut.id || 0,
                        no_etudiant: Number(file_line['Numero d\'étudiant']) || 0,
                    },
                },
                update: {},
                create: {
                    id_pays: pays.id,
                    id_statut: statut.id,
                    no_etudiant: Number(file_line['Numero d\'étudiant']),
                },
            });
            res.status(201).json({ ok: "true", bypassed: "false", message: 'La ligne de la liste d\'étudiants internationaux a été ajouté avec succès' });
        } catch (err) {
            res.status(400).json({ ok: "false", message: 'Un problème est survenu lors de l\'importation de la liste d\'étudiants internationaux' });
        }
    };

    static async removeInactiveStudents(req, res) {
        try {
            let ONE_HOUR_BEFORE = new Date();
            ONE_HOUR_BEFORE.setHours(ONE_HOUR_BEFORE.getHours() - 1);

            let FIVE_YEARS_BEFORE = new Date();
            FIVE_YEARS_BEFORE.setFullYear(FIVE_YEARS_BEFORE.getFullYear() - 5);

            // Get all students
            const etudiants = await prisma.etudiant.findMany({
                select: {
                    no_etudiant: true,
                    date_dernier_telechargement: true,
                    etat: true,
                },
            });

            etudiants.forEach(async (etudiant, index) => {
                // Make inactive students who weren't added to the last Rapport d'encadrement
                if (etudiant.date_dernier_telechargement.getTime() < ONE_HOUR_BEFORE) {
                    console.log("ONE HOUR: " + etudiant.no_etudiant);
                    await prisma.etudiant.update({
                        where: {
                            no_etudiant: etudiant.no_etudiant,
                        },
                        data: {
                            etat: false,
                        },
                    });
                }

                // Deletes students who were inactive for more than five years
                if (etudiant.date_dernier_telechargement.getTime() < FIVE_YEARS_BEFORE) {
                    console.log("FIVE YEARS: " + etudiant.no_etudiant);
                    await prisma.etudiant.delete({
                        where: {
                            no_etudiant: etudiant.no_etudiant,
                        },
                    });
                }
            });

            res.status(201).json({ message: 'La vérification des étudiants a bien été effectuée' });
        } catch (err) {
            res.status(400).json({ message: 'La vérification des étudiants a rencontrée un problème' });
        }
    };
  };

// function to convert excel date to normal js date  
function excelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate() + 1, hours, minutes, seconds);
}