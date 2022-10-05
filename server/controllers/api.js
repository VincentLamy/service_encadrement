const { PrismaClient } = require('@prisma/client');
const { Session } = require('inspector');

const prisma = new PrismaClient();

module.exports = class API {
    // Hello World
    static async HelloWorld(req, res) {
        res.send("Hello from API");
    }

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
        const file = req.body;
        const fileSize = file['Numéro de dossier'].length - 1;

        const array_code = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "20", "21", "22", "23", "24", "25", "30", "31", "40", "41", "42", "AUTN", "PROG", "CHAN"];
        const array_nom =
            ["Arrive souvent en retard", "Dort en classe", "N\'a pas le matériel requis pour le cours ou le laboratoire",
                "Quitte souvent avant la fin des cours", "Isolé en classe", "Facilement distrait, inattentif", "Enclin au bavardage",
                "Utilise son cellulaire en classe", "Prend plus de temps que les autres pour faire ses travaux et évaluations",
                "Travail remis en retard", "Travail non remis", "Ne lit pas ses MIO", "Ne fait pas les travaux ou exercices demandés",
                "Travail partiellement accompli", "Participe peu ou pas aux activités d'apprentissage", "Demande à l'enseignant ou à l'enseignante de faire seul un travail d'équipe",
                "Difficulté à se trouver une équipe de travail", "A demandé une évaluation différée sans raison valable", "Absent à une évaluation sans raison valable",
                "N'a pas terminé l'évaluation", "Autre (maximum de 3000 caractères):", "Progression", "Chances de réussite "]

        let size_array = array_code.length;

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

        //   try {
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

            //TODO Temp session
            const session = await prisma.session.upsert({
                where: { code: 'HIV22' || '' },
                update: {},
                create: {
                    code: 'HIV22',
                },
            });

            // Insert Groupe
            const groupe = await prisma.groupe.upsert({
                where: {
                    no_groupe_code_session: {
                        no_groupe: Number(file['Numéro du groupe'][i]) || 0,
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

            // Insert TA Etu Statut

        }
        res.status(201).json({ message: 'Rapport d\'encadrement ajouté avec succès' });
        //  } catch (err) {
        //       res.status(400).json({ message: err.message });
        //   }

        /*const {
            noDossier, codePermanent, prenomEtudiant, nomEtudiant, codeProgramme, sessionActuelle,  // Table Etudiant
            villeCampus,                                                                            // Campus
            codeCours, nomCours, duree,                                                             // Cours, besoin de l'id Campus
            prenomEnseignant, nomEnseignant,                                                        // Employe, besoin de l'id Type Employe
            numeroGroupe,                                                                           // Groupe, besoin de l'id Cours, Session, Employe
            codeRemarqueNoteFinale, notePonderee, pourcentageNoteCumulee, nbHeuresAbsences,         // TA Etudiant Groupe, garder juste l'id du code remarque
            typeRemarque, contenuRemarque,                                                          // Type Remarque
            codeRemarque, contenuCommentaire, date_creation,                                        // Commentaire, besoin de l'id Etudiant, Employe, Groupe, Type Remarque, garder juste l'id du code remarque                                                                         
            codeStatutEtudiant,                                                                     // TA Etu Statut, garder juste l'id du statut etudiant        
        } = req.body;*/

        // Manque le nom du cours
    };

    static async addSondageMathematiques(req, res) {
        const file = req.body;
        const fileSize = file['Adresse de messagerie'].length - 1;

        //  try {
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

            const formulaireMath = await prisma.formulaireMath.upsert({
                where: { no_etudiant: Number(noEtudiant[0]) || 0 },
                update: {},
                create: {
                    heure_debut: new Date(file['Heure de début'][i]),
                    heure_fin: new Date(file['Heure de fin'][i]),
                    effort_fourni: file['L\'effort fourni au secondaire pour réussir ?'][i],
                    experience_informatique: file['Indiquer votre expérience en informatique avant le Cégep (pas juste effleuré la chose) ?'][i], //TODO remove the ""
                    no_etudiant: Number(noEtudiant[0]),
                },
            });

            // Insert TA Math 4
            const TAMath4 = await prisma.tA_Math.upsert({
                where: {
                    id_cours_math_id_formulaire_math: {
                        id_cours_math: coursMath4.id,
                        id_formulaire_math: formulaireMath.id,
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
                        id_cours_math: coursMath5.id,
                        id_formulaire_math: formulaireMath.id,
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

        res.status(201).json({ message: 'Sondage mathématiques ajouté avec succès' });
        // } catch (err) {
        //     res.status(400).json({ message: err.message });
        // }
    };

    static async addEtudiantsInternationaux(req, res) {
        const file = req.body;
        console.log(file);

        res.status(201).json({ message: 'Liste d\'étudiants internationaux ajouté avec succès' });
    };
};