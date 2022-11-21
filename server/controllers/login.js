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
      // try {
          // Création du token.
          const token = crypto.lib.WordArray.random(64).toString();

          // On va chercher le numéro de l'employé dans la BD pour voir s'il existe.
          const user = await prisma.utilisateur.findFirst({
              where: {
                  // courriel: "admin@admin.com"
                  courriel: req.body.email,
                  // token: req.body.token
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
                  ciphers: 'SSLv3'
                },
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            let recover_link = "http://localhost:8080/reset_password/" + token
            let text = "Vous avez récemment fait une demande pour réinitialiser votre mot de passe. Si ce n'est pas vous, veuillez ignorer ce message ou contacter votre administrateur. Sinon, veuillez cliquer sur le lien suivant pour procéder à la réinitialisation de votre mot de passe.\n\nLien : " + recover_link;
          
            // Création du courriel
            var mailOptions = {
                from: process.env.EMAIL_ID,    
                to: "202045777@cegepsherbrooke.qc.ca", // to: req.body.courriel,
                subject: 'Demande de réinitialisation de mot de passe',
                text: text
            };
          
              // Envoie du courriel
              transporter.sendMail(mailOptions, function(error, info){ //TODO vérifier si on doit enlever les console.log()
                  if (error) {
                      console.log(error);       
                  } else {
                      console.log('Email sent: ' + info.response);
                  }
              });

              // jwt.sign({user: user}, 'key_se', (err, token) => {
              res.status(200).json({ link });
              // });
          } else {
              res.status(400).json({message: 'Erreur lors de la connexion' });
          }

          return false;
      // } catch (error) {
      //     res.status(400).json({message: 'Erreur lors de la connexion' });
      // }
  }

  static async reset_password(req, res) {
    console.log(req.params.token);
    
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
      await prisma.utilisateur.update({
        where: {
          token: req.params.token
        },
        data: {
          mdp:  SHA256(req.body.password).toString(),
          // token: "",
          // token_end_date: "",
        }
      });
    }
    
  }
};
