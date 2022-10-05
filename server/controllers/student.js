const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = class Student {
    static async getListStudent(req, res) {
     try {
          const students = await prisma.etudiant.findMany({               
               // select: {
               //      no_etudiant: true,
               //      nom: true,
               //      prenom: true,
               //      TA_EtuStatut: {
               //           select: {
               //                statut_etudiant: {
               //                     select: {
               //                          code: true,
               //                     }
               //                }
               //           }
               //      }
               // },
               include: {
                    Commentaire: {
                         _count: {
                              id: true,
                         },
                         where: {
                              no_etudiant: etudiant.no_etudiant,
                         }
                    }
               }
               
               // No_etudiant
               // Nom + Prénom
               // Statut
               // Quantité commentaires
               // Nombre cours difficulté
          });   
          res.status(200).json(students);
     } catch (error) {
          res.status(404).json({ message: error.message });
     }
    };
};