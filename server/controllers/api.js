const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = class API {
    static async getCommentsByStudentId(req, res) {
        const no_etudiant = req.params.no_etudiant;
        const comments = await prisma.Commentaire.findMany({
            where: {
                no_etudiant: Number(no_etudiant),
            },
        });
        res.json(comments);
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

        try {
            // Type employé
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
                    where: { ville: file['Campus'][i] || 0 },
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

                /*
                const nomEnseignant = file['Nom de l\'enseignant'][i].split(',');

                // Insert Enseignant
                const employe = await prisma.employe.upsert({
                    where: {nom: nomEnseignant[0], prenom: nomEnseignant[1]  || 0},
                    update: {},
                    create: {
                        id : Noemploye[],
                        id_type_employe : type_employe.id,
                        nom: nomEnseignant[0],
                        prenom: nomEnseignant[1],
                    },
                });
                */
            }
            res.status(201).json({ message: 'Rapport d\'encadrement ajouté avec succès' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }

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

        console.log(file);

        //  try {
        for (let i = 0; i < fileSize; i++) {
            // Insert Cours Math 4
            const coursMath4 = await prisma.coursMath.upsert({
                where: {
                    nom_annee: {
                        nom: file['Le cours de mathématiques que vous avez suivi en secondaire 4 ?'][i],
                        annee: 4
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
                        annee: 5
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
            /*
            const noEtudiant = file['Adresse de messagerie'][i].split('@');
            const formulaireMath = await prisma.formulaireMath.upsert({
                where: { no_etudiant: noEtudiant[0] || 0 },
                update: {},
                create: {
                    heure_debut: file['Heure de début'][i],
                    heure_fin: file['Heure de fin'][i],
                    effort_fourni: file['L\'effort fourni au secondaire pour réussir ?'][i],
                    experience_informatique: file['Indiquer votre expérience en informatique avant le Cégep (pas juste effleuré la chose) ?'][i][0],
                    no_etudiant: noEtudiant[0],
                },
            });
            */
        }

        res.status(201).json({ message: 'Rapport d\'encadrement ajouté avec succès' });
        // } catch (err) {
        //     res.status(400).json({ message: err.message });
        // }
    };
};

