const { PrismaClient } = require('@prisma/client');
const e = require('express');
const { stat } = require('fs');
const { Session } = require('inspector');

const prisma = new PrismaClient();

module.exports = class API {
    static async addSession(req, res) {
        const { code } = req.body;
        const session = await prisma.session.create({
            data: {
                code: code,
            },
        });
        res.json(session);
    };

    static async getSession(req, res) {
        const sessions = await prisma.session.findMany();
        res.json(sessions);
    };

    static async addRapportEncadrement(req, res) {
        try {
            const file = req.body;
            const fileSize = file['Numéro de dossier'].length - 1;

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

            // Insert Code remarques
            for (let i = 0; i < size_array; i++) {
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
                where: { id: 1 || 0 },
                update: {},
                create: {
                    id: 1,
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

            for (let i = 0; i < fileSize; i++) {
                // Insert Programme
                const programme = await prisma.programme.upsert({
                    where: { code: file['Numéro du programme'][i] || 0 },
                    update: {},
                    create: {
                        code: file['Numéro du programme'][i],
                        nom: '',
                        description: '',
                    },
                });

                // Split Etudiant name
                const nomEtudiant = file['Nom de l\'étudiant'][i].split(',');

                // Insert Etudiant
                const etudiant = await prisma.etudiant.upsert({
                    where: { no_etudiant: Number(file['Numéro de dossier'][i]) || 0 },
                    update: {
                        no_etudiant: Number(file['Numéro de dossier'][i]),
                        code_permanent: file['Code permanent'][i],
                        nom: nomEtudiant[0],
                        prenom: nomEtudiant[1],
                        session_actuelle: Number(file['Session du programme d\'études'][i]),
                        code_programme: programme.code,
                    },
                    create: {
                        no_etudiant: Number(file['Numéro de dossier'][i]),
                        code_permanent: file['Code permanent'][i],
                        nom: nomEtudiant[0],
                        prenom: nomEtudiant[1],
                        session_actuelle: Number(file['Session du programme d\'études'][i]),
                        code_programme: programme.code,
                    },
                });

                // Insert Campus
                const campus = await prisma.campus.upsert({
                    where: { ville: file['Campus'][i] || '' },
                    update: {},
                    create: {
                        ville: file['Campus'][i],
                    },
                });

                // Insert Cours
                const cours = await prisma.cours.upsert({
                    where: { code: file['Numéro du cours'][i] || 0 },
                    update: {},
                    create: {
                        code: file['Numéro du cours'][i],
                        nom: '',
                        duree: Number(file['Nb heures du cours'][i]),
                        id_campus: campus.id,
                    },
                });

                // Split Enseignant name
                const nomEnseignant = file['Nom de l\'enseignant'][i].split(',');

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
                            no_groupe: Number(file['Numéro du groupe'][i]) || 0,
                            code_cours: cours.code,
                            code_session: session.code || 0,
                        }
                    },
                    update: {},
                    create: {
                        no_groupe: Number(file['Numéro du groupe'][i]),
                        code_cours: cours.code,
                        code_session: session.code,
                        no_employe: employe.no_employe,
                    },
                });

                // Insert Code Remarque
                const codeRemarqueNoteFinale = await prisma.codeRemarqueNoteFinale.upsert({
                    where: { nom: file['Code de remarque de la note finale'][i] || '' },
                    update: {},
                    create: {
                        nom: file['Code de remarque de la note finale'][i],
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
                        note_ponderee: parseFloat(file['Note Pondérée'][i].replace(',', '.')) || 0,
                        pourcentage_note_cumulee: parseFloat(file['Pourcentage note cumulée'][i].replace(',', '.')) || 0,
                        duree_absence: parseFloat(file['Nb heures d\'absences'][i].replace(',', '.')) || 0,
                    },
                    create: {
                        no_etudiant: etudiant.no_etudiant,
                        id_groupe: groupe.id,
                        id_code_remarque_note_finale: codeRemarqueNoteFinale.id,
                        note_ponderee: parseFloat(file['Note Pondérée'][i].replace(',', '.')) || 0,
                        pourcentage_note_cumulee: parseFloat(file['Pourcentage note cumulée'][i].replace(',', '.')) || 0,
                        duree_absence: parseFloat(file['Nb heures d\'absences'][i].replace(',', '.')) || 0,
                    },
                });

                if (file['Date de saisie de la remarque'][i]) {
                    // Traitement des remarques
                    let titre = "";
                    let contenu = "";

                    if (file['Type de remarque'][i] === "Remarque") {
                        titre = file['Description de la remarque'][i];
                        contenu = file['Commentaire'][i];
                    }
                    else if (file['Type de remarque'][i] === "Chances de réussite") {
                        titre = "Autre";
                        contenu = file['Description de la remarque'][i];
                    }
                    else if (file['Type de remarque'][i] === "4") {
                        titre = "Progression";

                        if (file['Description de la remarque'][i] === "0") {
                            contenu = "Non applicable";
                        }
                        else if (file['Description de la remarque'][i] === "1") {
                            contenu = "Faibles";
                        }
                        else if (file['Description de la remarque'][i] === "2") {
                            contenu = "Moyennes";
                        }
                        else if (file['Description de la remarque'][i] === "3") {
                            contenu = "Bonnes";
                        }
                        else if (file['Description de la remarque'][i] === "4") {
                            contenu = "Très bonnes";
                        }
                    }
                    else if (file['Type de remarque'][i] === "5") {
                        titre = "Chances de réussite";

                        if (file['Description de la remarque'][i] === "0") {
                            contenu = "Non applicable";
                        }
                        else if (file['Description de la remarque'][i] === "1") {
                            contenu = "Faibles";
                        }
                        else if (file['Description de la remarque'][i] === "2") {
                            contenu = "Moyennes";
                        }
                        else if (file['Description de la remarque'][i] === "3") {
                            contenu = "Bonnes";
                        }
                        else if (file['Description de la remarque'][i] === "4") {
                            contenu = "Très bonnes";
                        }
                    }

                    if (file['Commentaire'][i] && (file['Type de remarque'][i] === "4" || file['Type de remarque'][i] === "5")) contenu += " - " + file['Commentaire'][i];

                    // Insert Commentaire
                    const commentaire = await prisma.commentaire.upsert({
                        where: {
                            no_etudiant_id_code_remarque_date_creation: {
                                no_etudiant: etudiant.no_etudiant || 0,
                                id_code_remarque: file['Code de la remarque'][i] || 0,
                                date_creation: new Date(file['Date de saisie de la remarque'][i]) || 0,
                            }
                        },
                        update: {},
                        create: {
                            no_etudiant: etudiant.no_etudiant,
                            no_employe: employe.no_employe,
                            id_groupe: groupe.id,
                            date_creation: new Date(file['Date de saisie de la remarque'][i]),
                            id_code_remarque: file['Code de la remarque'][i],
                            titre: titre,
                            contenu: contenu,
                        },
                    });
                }

                // Traitement Statut Etudiant Cours
                let statutEtuCours = file['StatutEtuCours'][i];
                statutEtuCours = statutEtuCours.replace(/\s/g, ''); // Deleting spaces

                if (statutEtuCours.charAt(0) == "\"" && statutEtuCours.charAt(statutEtuCours.length - 1) == "\"") statutEtuCours = statutEtuCours.slice(1, -1); // Deleting quotation marks

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
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    };

    static async addSondageMathematiques(req, res) {
        try {
            const file = req.body;
            const fileSize = file['Adresse de messagerie'].length - 1;

            for (let i = 0; i < fileSize; i++) {
                // Insert Cours Math 4
                const coursMath4 = await prisma.coursMath.upsert({
                    where: {
                        nom_annee: {
                            nom: file['Le cours de mathématiques que vous avez suivi en secondaire 4 ?'][i],
                            annee: 4,
                        }
                    },
                    update: {},
                    create: {
                        nom: file['Le cours de mathématiques que vous avez suivi en secondaire 4 ?'][i],
                        annee: 4,
                        code: "",
                    },
                });

                // Insert Cours Math 5
                const coursMath5 = await prisma.coursMath.upsert({
                    where: {
                        nom_annee: {
                            nom: file['Le cours de mathématiques que vous avez suivi en secondaire 5 ?'][i],
                            annee: 5,
                        }
                    },
                    update: {},
                    create: {
                        nom: file['Le cours de mathématiques que vous avez suivi en secondaire 5 ?'][i],
                        annee: 5,
                        code: "",
                    },
                });

                // Insert Formulaire Math
                const noEtudiant = file['Adresse de messagerie'][i].split('@');

                let experienceInformatique = file['Indiquer votre expérience en informatique avant le Cégep (pas juste effleuré la chose) ?'][i];

                if (experienceInformatique.charAt(0) == "\"" && experienceInformatique.charAt(experienceInformatique.length - 1) == "\"") experienceInformatique = experienceInformatique.slice(1, -1); // Deleting quotation marks

                const formulaireMath = await prisma.formulaireMath.upsert({
                    where: { no_etudiant: Number(noEtudiant[0]) || 0 },
                    update: {},
                    create: {
                        heure_debut: new Date(file['Heure de début'][i]),
                        heure_fin: new Date(file['Heure de fin'][i]),
                        effort_fourni: file['L\'effort fourni au secondaire pour réussir ?'][i],
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
                        note_obtenue: file['La note obtenue pour le cours de mathématiques que vous avez suivi en secondaire 4 ?'][i],
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
                        note_obtenue: file['La note obtenue pour le cours de mathématiques que vous avez suivi en secondaire 5 ?'][i],
                    },
                });
            }

            res.status(201).json({ message: 'Le sondage de mathématiques a été ajouté avec succès' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    };

    static async addEtudiantsInternationaux(req, res) {
        try {
            const file = req.body;
            const fileSize = file['Numero d\'étudiant'].length - 1;

            for (let i = 0; i < fileSize; i++) {
                // Insert Pays
                const pays = await prisma.pays.upsert({
                    where: { nom: file['Pays d\'origine'][i] || '' },
                    update: {},
                    create: {
                        nom: file['Pays d\'origine'][i],
                    },
                });

                // Insert Statut
                const statut = await prisma.statut.upsert({
                    where: { nom: file['Statut'][i] || '' },
                    update: {},
                    create: {
                        nom: file['Statut'][i],
                        description: '',
                    },
                });

                // Insert TA Etudiant Pays Statut
                const TAEtudiantPaysStatut = await prisma.tA_EtudiantPaysStatut.upsert({
                    where: {
                        id_pays_id_statut_no_etudiant: {
                            id_pays: pays.id || 0,
                            id_statut: statut.id || 0,
                            no_etudiant: Number(file['Numero d\'étudiant'][i]) || 0,
                        },
                    },
                    update: {},
                    create: {
                        id_pays: pays.id,
                        id_statut: statut.id,
                        no_etudiant: Number(file['Numero d\'étudiant'][i]),
                    },
                });
            }
            res.status(201).json({ message: 'La liste d\'étudiants internationaux a été ajouté avec succès' });

        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    };
};

