const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class StudentGroup {
  static async getStudentGroupByStudent(req, res) {
    const no_etudiant = req.params.no_etudiant;
    const classes = await prisma.TA_EtudiantGroupe.findMany({
      where: {
        no_etudiant: Number(no_etudiant),
      }
    });
    res.json(classes);
  }
}