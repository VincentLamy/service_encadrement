const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const SHA256 = require("crypto-js/sha256");
require("dotenv").config();

module.exports = class Responsable {
  static async login(req, res) {
    try {
      const user = await prisma.utilisateur.findFirst({
        where: {
          courriel: req.body.username,
          mdp: SHA256(req.body.password).toString(),
        },
        select: {
          id: true,
          employe: {
            select: {
              no_employe: true,
              prenom: true,
              nom: true,
            },
          },
          type_utilisateur: {
            select: {
              nom: true,
            },
          },
          actif: true,
        },
      });

      if (user) {
        jwt.sign({ user: user }, process.env.JWT_KEY, (err, token) => {
          res.status(200).json({ user, token });
        });
      } else {
        res.status(400).json({ message: "Erreur lors de la connexion" });
      }
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la connexion" });
    }
  }
};
