const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Semester {
  static async getSemesterByStudent(req, res) {
    const no_etudiant = req.params.no_etudiant;
    const semesters = await prisma.Session.groupBy({
      by: ['id', 'code'],
      where: {
        Groupe: {
          some: {
            TA_EtudiantGroupe: {
              some: {
                no_etudiant: Number(no_etudiant),
              },
            },
          },
        },
      },
    });
    res.json(semesters);
  }
}