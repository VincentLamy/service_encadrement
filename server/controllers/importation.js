const { PrismaClient } = require('@prisma/client');
const e = require('express');
const { stat } = require('fs');
const { Session } = require('inspector');

const prisma = new PrismaClient();
const jwtVerification = require('../modules/jwt_verification');

module.exports = class Importation {
    static async addRapportEncadrement(req, res) {
    //try {
        if (jwtVerification(req.token) === false) {
            res.status(403).json();
            return;
        }

            const file = req.body;

            // Traitement code de remarques
            const array_code = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "20", "21", "22", "23", "24", "25", "30", "31", "40", "41", "42", "AUTN", "PROG", "CHAN"];
            const array_nom =
                ["Arrive souvent en retard", "Dort en classe", "N\'a pas le matériel requis pour le cours ou le laboratoire",
                    "Quitte souvent avant la fin des cours", "Isolé en classe", "Facilement distrait, inattentif", "Enclin au bavardage",
                    "Utilise son cellulaire en classe", "Prend plus de temps que les autres pour faire ses travaux et évaluations",
                    "Travail remis en retard", "Travail non remis", "Ne lit pas ses MIO", "Ne fait pas les travaux ou exercices demandés",
                    "Travail partiellement accompli", "Participe peu ou pas aux activités d'apprentissage", "Demande à l'enseignant ou à l'enseignante de faire seul un travail d'équipe",
                    "Difficulté à se trouver une équipe de travail", "A demandé une évaluation différée sans raison valable", "Absent à une évaluation sans raison valable",
                    "N'a pas terminé l'évaluation", "Autre (maximum de 3000 caractères):", "Progression", "Chances de réussite "]

            const size_array = array_code.length;
            for (let i = 0; i < size_array; i++) {
                // Insert Code remarque
                const code_remarque = await prisma.codeRemarque.upsert({
                    where: { code: array_code[i] || 0 },
                    update: {},
                    create: {
                        code: array_code[i],
                        nom: array_nom[i],
                    },
                });
            }

            // Insert Type employé
            const type_employe = await prisma.typeEmploye.upsert({
                where: { nom: "Enseignant" || 0 },
                update: {},
                create: {
                    nom: 'Enseignant',
                    description: 'Cet employé est un enseignant dans le département d\'informatique',
                },
            });

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

            for (let i = 0; i < file.length; i++) {
                // Insert Programme
                const programme = await prisma.programme.upsert({
                    where: { code: file[i]['Numéro du programme'] || 0 },
                    update: {},
                    create: {
                        code: String(file[i]['Numéro du programme']),
                        nom: '',
                        description: '',
                    },
                });

                // Split Etudiant name
                const nomEtudiant = file[i]['Nom de l\'étudiant'].split(',');

                // Insert Etudiant
                const etudiant = await prisma.etudiant.upsert({
                    where: { no_etudiant: Number(file[i]['Numéro de dossier']) || 0 },
                    update: {
                        no_etudiant: Number(file[i]['Numéro de dossier']),
                        code_permanent: file[i]['Code permanent'],
                        nom: nomEtudiant[0],
                        prenom: nomEtudiant[1],
                        session_actuelle: Number(file[i]['Session du programme d\'études']),
                        code_programme: programme.code,
                    },
                    create: {
                        no_etudiant: Number(file[i]['Numéro de dossier']),
                        code_permanent: file[i]['Code permanent'],
                        nom: nomEtudiant[0],
                        prenom: nomEtudiant[1],
                        session_actuelle: Number(file[i]['Session du programme d\'études']),
                        code_programme: programme.code,
                    },
                });

                // Insert Campus
                const campus = await prisma.campus.upsert({
                    where: { ville: file[i]['Campus'] || '' },
                    update: {},
                    create: {
                        ville: file[i]['Campus'],
                    },
                });

                // Insert Cours
                const cours = await prisma.cours.upsert({
                    where: { code: file[i]['Numéro du cours'] || 0 },
                    update: {},
                    create: {
                        code: file[i]['Numéro du cours'],
                        nom: '',
                        duree: Number(file[i]['Nb heures du cours']),
                        id_campus: campus.id,
                    },
                });

                if (!file[i]['Nom de l\'enseignant']) {
                    file[i]['Nom de l\'enseignant'] = file[i - 1]['Nom de l\'enseignant'];
                }

                // Split Enseignant name
                const nomEnseignant = file[i]['Nom de l\'enseignant'].split(',');

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
                        id_type_employe: type_employe.id,
                        nom: nomEnseignant[0],
                        prenom: nomEnseignant[1],
                    },
                });

                // Insert Groupe
                const groupe = await prisma.groupe.upsert({
                    where: {
                        no_groupe_code_cours_code_session: {
                            no_groupe: Number(file[i]['Numéro du groupe']) || 0,
                            code_cours: cours.code,
                            code_session: session.code || 0,
                        }
                    },
                    update: {},
                    create: {
                        no_groupe: Number(file[i]['Numéro du groupe']),
                        code_cours: cours.code,
                        code_session: session.code,
                        no_employe: employe.no_employe,
                    },
                });

                // Insert Code Remarque
                const codeRemarqueNoteFinale = await prisma.codeRemarqueNoteFinale.upsert({
                    where: { nom: file[i]['Code de remarque de la note finale'] || '' },
                    update: {},
                    create: {
                        nom: file[i]['Code de remarque de la note finale'],
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
                        note_ponderee: parseFloat(file[i]['Note Pondérée']) || 0,
                        pourcentage_note_cumulee: parseFloat(file[i]['Pourcentage note cumulée']) || 0,
                        duree_absence: parseFloat(file[i]['Nb heures d\'absences']) || 0,
                    },
                    create: {
                        no_etudiant: etudiant.no_etudiant,
                        id_groupe: groupe.id,
                        id_code_remarque_note_finale: codeRemarqueNoteFinale.id,
                        note_ponderee: parseFloat(file[i]['Note Pondérée']) || 0,
                        pourcentage_note_cumulee: parseFloat(file[i]['Pourcentage note cumulée']) || 0,
                        duree_absence: parseFloat(file[i]['Nb heures d\'absences']) || 0,
                    },
                });

                if (file[i]['Date de saisie de la remarque']) {
                    // Traitement des remarques
                    let titre = "";
                    let contenu = "";

                    if (file[i]['Type de remarque'] === "Remarque") {
                        titre = file[i]['Description de la remarque'];
                        contenu = file[i]['Commentaire'];
                    }
                    else if (file[i]['Type de remarque'] === "Chances de réussite") {
                        titre = "Autre";
                        contenu = file[i]['Description de la remarque'];
                    }
                    else if (file[i]['Type de remarque'] == "4") {
                        console.log("4");
                        
                        titre = "Progression";

                        if (file[i]['Description de la remarque'] == "0") {
                            contenu = "Non applicable";
                        }
                        else if (file[i]['Description de la remarque'] == "1") {
                            contenu = "Faibles";
                        }
                        else if (file[i]['Description de la remarque'] == "2") {
                            contenu = "Moyennes";
                        }
                        else if (file[i]['Description de la remarque'] == "3") {
                            contenu = "Bonnes";
                        }
                        else if (file[i]['Description de la remarque'] == "4") {
                            contenu = "Très bonnes";
                        }
                    }
                    else if (file[i]['Type de remarque'] == "5") {
                        console.log("5");
                        titre = "Chances de réussite";

                        if (file[i]['Description de la remarque'] == "0") {
                            contenu = "Non applicable";
                        }
                        else if (file[i]['Description de la remarque'] == "1") {
                            contenu = "Faibles";
                        }
                        else if (file[i]['Description de la remarque'] == "2") {
                            contenu = "Moyennes";
                        }
                        else if (file[i]['Description de la remarque'] == "3") {
                            contenu = "Bonnes";
                        }
                        else if (file[i]['Description de la remarque'] == "4") {
                            contenu = "Très bonnes";
                        }
                    }
                
                    if (file[i]['Commentaire'] && (file[i]['Type de remarque'] == "4" || file[i]['Type de remarque'] == "5")) {
                        contenu += " - " + file[i]['Commentaire'];
                    }

                    console.log("Contenu du " + i + " :" + contenu);
                    console.log("Titre du " + i + " :" + titre);

                    // Insert Commentaire
                    const commentaire = await prisma.commentaire.upsert({
                        where: {
                            no_etudiant_id_code_remarque_titre_date_creation: {
                                no_etudiant: etudiant.no_etudiant || 0,
                                id_code_remarque: String(file[i]['Code de la remarque']) || "",
                                titre: titre,
                                date_creation: excelDateToJSDate(file[i]['Date de saisie de la remarque']) || 0,
                            }
                        },
                        update: {},
                        create: {
                            no_etudiant: etudiant.no_etudiant,
                            no_employe: employe.no_employe,
                            id_groupe: groupe.id,
                            id_code_remarque: String(file[i]['Code de la remarque']) || 0,
                            date_creation: excelDateToJSDate(file[i]['Date de saisie de la remarque']) || 0,
                            titre: titre,
                            contenu: contenu,
                        },
                    });
                }

                // Traitement Statut Etudiant Cours
                let statutEtuCours = file[i]['StatutEtuCours'];
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
            }
            res.status(201).json({ message: 'Le rapport d\'encadrement a été ajouté avec succès' });
      //  } catch (err) {
       //     res.status(400).json({ message: 'Le rapport d\'encadrement n\'a pas pu être ajouté' });
       // }
    };

    static async addSondageMathematiques(req, res) {
        try {
            if (jwtVerification(req.token) === false) {
                res.status(403).json();
                return;
            }

            const file = req.body;

            for (let i = 0; i < file.length; i++) {
                // Insert Cours Math 4
                const coursMath4 = await prisma.coursMath.upsert({
                    where: {
                        nom_annee: {
                            nom: file[i]['Le cours de mathématiques que vous avez suivi en secondaire 4 ?'],
                            annee: 4,
                        }
                    },
                    update: {},
                    create: {
                        nom: file[i]['Le cours de mathématiques que vous avez suivi en secondaire 4 ?'],
                        annee: 4,
                        code: "",
                    },
                });

                // Insert Cours Math 5
                const coursMath5 = await prisma.coursMath.upsert({
                    where: {
                        nom_annee: {
                            nom: file[i]['Le cours de mathématiques que vous avez suivi en secondaire 5 ?'],
                            annee: 5,
                        }
                    },
                    update: {},
                    create: {
                        nom: file[i]['Le cours de mathématiques que vous avez suivi en secondaire 5 ?'],
                        annee: 5,
                        code: "",
                    },
                });

                // Insert Formulaire Math
                const noEtudiant = file[i]['Adresse de messagerie'].split('@');

                let experienceInformatique = file[i]['Indiquer votre expérience en informatique avant le Cégep (pas juste effleuré la chose) ?'];

                const formulaireMath = await prisma.formulaireMath.upsert({
                    where: { no_etudiant: Number(noEtudiant[0]) || 0 },
                    update: {},
                    create: {
                        heure_debut: excelDateToJSDate(file[i]['Heure de début']),
                        heure_fin: excelDateToJSDate(file[i]['Heure de fin']),
                        effort_fourni: file[i]['L\'effort fourni au secondaire pour réussir ?'],
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
                        note_obtenue: file[i]['La note obtenue pour le cours de mathématiques que vous avez suivi en secondaire 4 ?'],
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
                        note_obtenue: file[i]['La note obtenue pour le cours de mathématiques que vous avez suivi en secondaire 5 ?'],
                    },
                });
            }

            res.status(201).json({ message: 'Le sondage de mathématiques a été ajouté avec succès' });
        } catch (err) {
            res.status(400).json({ message: 'Le sondage de mathématiques n\'a pas pu être ajouté' });
        }
    };

    static async addEtudiantsInternationaux(req, res) {
        try {
            if (jwtVerification(req.token) === false) {
                res.status(403).json();
                return;
            }

            const file = req.body;

            for (let i = 0; i < file.length; i++) {
                // Insert Pays
                const pays = await prisma.pays.upsert({
                    where: { nom: file[i]['Pays d\'origine'] || '' },
                    update: {},
                    create: {
                        nom: file[i]['Pays d\'origine'],
                    },
                });

                // Insert Statut
                const statut = await prisma.statut.upsert({
                    where: { nom: file[i]['Statut'] || '' },
                    update: {},
                    create: {
                        nom: file[i]['Statut'],
                        description: '',
                    },
                });

                // Insert TA Etudiant Pays Statut
                const TAEtudiantPaysStatut = await prisma.tA_EtudiantPaysStatut.upsert({
                    where: {
                        id_pays_id_statut_no_etudiant: {
                            id_pays: pays.id || 0,
                            id_statut: statut.id || 0,
                            no_etudiant: Number(file[i]['Numero d\'étudiant']) || 0,
                        },
                    },
                    update: {},
                    create: {
                        id_pays: pays.id,
                        id_statut: statut.id,
                        no_etudiant: Number(file[i]['Numero d\'étudiant']),
                    },
                });
            }
            res.status(201).json({ message: 'La liste d\'étudiants internationaux a été ajouté avec succès' });

        } catch (err) {
            res.status(400).json({ message: 'La liste d\'étudiants internationaux n\'a pas pu être ajouté' });
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