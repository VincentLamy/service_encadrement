const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Comment {
  static async addComment(req, res) {
    const {
      no_etudiant,
      no_employe,
      id_groupe,
      id_code_remarque,
      titre,
      contenu,
    } = req.body;
    try {
      await prisma.commentaire.create({
        data: {
          no_etudiant: Number(no_etudiant),
          no_employe: Number(no_employe),
          id_groupe: Number(id_groupe),
          id_code_remarque: id_code_remarque,
          titre: titre,
          contenu: contenu,
        },
      });
      res.status(201).json({ message: 'Le commentaire a été ajouté avec succès' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
