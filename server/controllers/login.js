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

  static async recover_password(req, res) {
      // try {
          const supervisor_number = await prisma.utilisateur.findFirst({
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

          const user = await prisma.utilisateur.findFirst({
              where: {
                  no_employe : supervisor_number.employe.no_employe
              },  
              select: {
                  courriel: true,
              }
          });
      
          // TODO vérifier token
          
          if (user) {
              var nodemailer = require('nodemailer');
              var link;

              var transporter = nodemailer.createTransport({
                  host: 'smtp-mail.outlook.com',      //TODO changer pour le domaine du cégep
                  secureConnection: false,
                  port: 587,
                  tls: {
                      ciphers: 'SSLv3'
                  },
                  auth: {
                      user: process.env.EMAIL_ID,
                      pass: process.env.EMAIL_PASSWORD
                  }
              });
          
              var mailOptions = {
                  from: process.env.EMAIL_ID,    
                  to: user.courriel,
                  subject: 'Demande de réinitialisation de mot de passe',
                  text: ``
              };
          
              transporter.sendMail(mailOptions, function(error, info){
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
};
