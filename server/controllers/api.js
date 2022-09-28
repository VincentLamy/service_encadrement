const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fs = require("fs");
const csvParser = require("csv-parser");


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

        //  try {
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
        }
        res.status(201).json({ message: 'Rapport d\'encadrement ajouté avec succès' });
        //  } catch (err) {
        //     res.status(400).json({ message: err.message });
        // }

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
};