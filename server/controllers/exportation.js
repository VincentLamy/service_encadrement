const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const data_exporter = require('json2csv').Parser;

module.exports = class Exportation {
  static async exportRapportEncadrement(req, res) {
    const students = await prisma.Etudiant.findMany({
      include: {
        TA_EtudiantGroupe: true,
        TA_EtuStatut: true,
        FormulaireMath: true,
        TA_EtudiantPaysStatut: true,
        Commentaire: true,
      }
    });

    students.forEach(student => {
      student.nom_etudiant = student.nom + "," + student.prenom;
      delete student.nom;
      delete student.prenom;
    });

    students.forEach(student => {
      console.log(student.TA_EtudiantGroupe);
    });

    res.status(200).json(students);
  };
}