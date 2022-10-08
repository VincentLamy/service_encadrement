const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = class Student {
     static async getAllStudent(req, res) {
          try {
               const students = await prisma.Etudiant.findMany({
                    select: {
                         no_etudiant: true,
                         prenom: true,
                         nom: true,
                         TA_EtuStatut: {
                              select: {
                                   statut_etudiant: true,
                              }
                         },
                         TA_EtudiantGroupe: {
                              select: {
                                   note_ponderee: true,
                                   pourcentage_note_cumulee: true,
                              }
                         }
                    }
               }); 

               for (let index = 0; index < students.length; index++) {
                    const commentaire = await prisma.commentaire.findMany({
                         select: {
                              id: true,
                         },
                         where: {
                              no_etudiant: students[index].no_etudiant,
                         }
                    });
                    
                    students[index].commentary_quantity = commentaire.length;

               }

               res.status(200).json(students);
          } catch (error) {
               res.status(404).json({ message: error.message });
          }
     };
};