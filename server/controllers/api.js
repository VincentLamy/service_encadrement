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


        //console.log(file.StatutEtuCours[5]);
        //console.log(file);
        for (let i = 0; i < Object.keys(file).length; i++) {
            console.log(file['Numéro du programme'][i]);
            //const etudiant = await prisma.session.create({
            //    data: {

            //    }
            //});
        }
        res.status(201).json({ message: 'Rapport d\'encadrement ajouté avec succès' });
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