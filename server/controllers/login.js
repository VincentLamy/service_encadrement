const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const crypto = require("crypto-js");
const SHA256 = require("crypto-js/sha256");

const nodemailer = require('nodemailer');
const { link } = require("fs");

require('dotenv').config();


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
          sessions: true,
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

  static async recover_password(req, res) {
    try {
      // Création du token.
      const token = crypto.lib.WordArray.random(64).toString();

      // On va chercher le numéro de l'employé dans la BD pour voir s'il existe.
      const user = await prisma.utilisateur.findFirst({
        where: {
          courriel: req.body.email,
          token: req.body.token // IMPORTANT Si cause problème -> à enlever.
        },
        select: {
          employe: {
            select: {
              no_employe: true,
            }
          }
        },
      });

      // Définit la date d'expiration du token
      let date_expiration = new Date();
      date_expiration.setDate(date_expiration.getDate() + 1);

      // Si l'employé existe
      if (user) {
        // Ajoute le token et la date d'expiration dans la table.
        await prisma.utilisateur.update({
          where: {
            no_employe: user.employe.no_employe
          },
          data: {
            token: token,
            token_end_date: date_expiration,
          }
        })

        // Création des options de connexion
        var transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secureConnection: false,
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
          },
          auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD
          }
        });

        let recover_link = "http://" + process.env.URL + "/password/reset/" + token;
        let text = "Vous avez récemment fait une demande pour réinitialiser votre mot de passe. Si ce n'est pas vous, veuillez ignorer ce message ou contacter votre administrateur. Sinon, veuillez cliquer sur le lien suivant pour procéder à la réinitialisation de votre mot de passe.\n\nLien : " + recover_link;

        // Création du courriel
        var mailOptions = {
          from: process.env.EMAIL_ID,
          to: req.body.courriel,
          subject: 'Demande de réinitialisation de mot de passe',
          text: text
        };

        // Envoie du courriel
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.status(400).json({ message: "Erreur lors de l\'envoie du courriel" });
          } else {
            res.status(200).json({ message: "Courriel envoyé" });
          }
        });
      }
    }
    catch (error) {
      res.status(400).json({ message: 0 });
    }
  }

  static async password_modif(req, res) {
    const user = await prisma.utilisateur.findFirst({
      where: {
        token: req.params.token,
      },
      select: {
        employe: {
          select: {
            no_employe: true,
          }
        }
      },
    });

    if (user) {
      try {
        if (req.params.type == "reset") {
          await prisma.utilisateur.update({
            where: {
              token: req.params.token
            },
            data: {
              mdp: SHA256(req.body.password).toString(),
              token: undefined,
              token_end_date: undefined,
            }
          });

          res.status(200).json({ message: 1, type: "reset" });
        } else if (req.params.type == "activate") {
          const today = new Date();
          await prisma.utilisateur.update({
            where: {
              token: req.params.token,
            },
            data: {
              date_activation: today,
              date_desactivation: today,
              mdp: SHA256(req.body.password).toString(),
              actif: Boolean(1),
              token: undefined,
              token_end_date: undefined,
            }
          });

          res.status(200).json({ message: 1, type: "activate" });
        }
      } catch (error) {
        res.status(400).json({ message: 0 });
      }
    }
  }
};