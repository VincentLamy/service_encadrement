const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Comment {
  static async addComment(req, res) {
    const {
      no_etudiant,
      no_employe,
      code_session,
      id_code_remarque,
      titre,
      contenu,
    } = req.body;

    // Sélectionner le groupe représentant une session s'il existe, sinon le créer.
    const groupe =
      (await prisma.groupe.findFirst({
        where: {
          no_groupe: 0,
          code_session: code_session,
        },
      })) ||
      (await prisma.groupe.create({
        data: {
          session: {
            connect: { code: code_session },
          },
        },
      }));
      
    // Créer le commentaire associé à une session
    try {
      await prisma.commentaire.create({
        data: {
          no_etudiant: Number(no_etudiant),
          no_employe: Number(no_employe),
          id_groupe: groupe.id,
          id_code_remarque: id_code_remarque,
          titre: titre,
          contenu: contenu,
        },
      });
      res
        .status(201)
        .json({ message: "Le commentaire a été ajouté avec succès" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async editComment(req, res) {
    const { id, titre, contenu, id_code_remarque } = req.body;

    try {
      await prisma.commentaire.update({
        where: {
          id: Number(id),
        },
        data: {
          titre: titre,
          contenu: contenu,
          id_code_remarque: id_code_remarque,
        },
      });
      res
        .status(200)
        .json({ message: "Le commentaire a été modifié avec succès" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
