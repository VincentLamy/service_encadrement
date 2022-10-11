const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Student {
  static async getAllStudent(req, res) {
    try {
      const students = await prisma.Etudiant.findMany({});
      res.status(200).json(students);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getStudentFormInfo(req, res) {
    const no_etudiant = req.params.no_etudiant;
    const students = await prisma.Etudiant.findUnique({
      where: {
        no_etudiant: Number(no_etudiant),
      },
      include: {
        TA_EtudiantGroupe: {
          include: {
            groupe: {
              include: {
                cours: true,
                session: true,
                Commentaire: {
                  include: {
                    employe: true,
                    code_remarque: true,
                  }
                },
              },
            },
          },
        },
      },
    });
    res.json(students);
  }
};
