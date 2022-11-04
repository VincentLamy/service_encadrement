const { PrismaClient } = require("@prisma/client");
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
            },
          },
          TA_EtudiantGroupe: {
            select: {
              note_ponderee: true,
              pourcentage_note_cumulee: true,
            },
          },
        },
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
  }

  static async getStudentFormInfo(req, res) {
    const no_etudiant = req.params.no_etudiant;

    // Get all necessary info for student form
    const student = await prisma.Etudiant.findUnique({
      where: {
        no_etudiant: Number(no_etudiant),
      },
      include: { 
        TA_EtuStatut: {
          include: {
            statut_etudiant: true,
          },
        },     
        TA_EtudiantGroupe: {
          include: {
            groupe: {
              include: {
                cours: {
                  include: {
                    campus: true,
                  },
                },
                session: true,
                Commentaire: {
                  where: {
                    no_etudiant: Number(no_etudiant),
                  },
                  orderBy: {
                    date_creation: "desc",
                  },
                  include: {
                    employe: true,
                    code_remarque: true,
                  },
                },
              },
            },
            code_remarque_note_finale: true,
          },
        },
        FormulaireMath: {
          include: {
            TA_Math: {
              include: {
                cours_math: true,
              },
            },
          },
        },
        TA_EtudiantPaysStatut: {
          include: {
            pays: true,
            statut: true,
          },
        },
      },
    });

    // Get semester comments for all semesters student has classes in
    const semester_comments = await prisma.commentaire.findMany({
      where: {
        no_etudiant: Number(no_etudiant),
        groupe: {
          no_groupe: 0,
        },
      },
      orderBy: {
        date_creation: "desc",
      },
      include: {
        groupe: true,
        employe: true,
        code_remarque: true,
      }
    });
    student.semester_comments = semester_comments;

    res.json(student);
  }
};
