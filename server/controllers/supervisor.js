const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwtVerification = require("../modules/jwt_verification");
const jwt = require("jsonwebtoken");

const crypto = require("crypto-js");
const SHA256 = require("crypto-js/sha256");

const nodemailer = require('nodemailer');

require('dotenv').config();

module.exports = class Supervisor {
  static async getSupervisorFormInfo(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const id = req.params.id;
      const supervisor = await prisma.utilisateur.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          employe: true,
        },
      });
      res.status(200).json(supervisor);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // create a supervisor
  static async addSupervisor(req, res) {
    try {
      const verification = jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {
          res.sendStatus(403);
          return false;
        }
        return true;
      });

      if (verification === false) return;

      const today = new Date();

      // Insert Type employé
      const type_employe = await prisma.typeEmploye.upsert({
        where: { nom: "Responsable d'encadrement" || 0 },
        update: {},
        create: {
          nom: "Responsable d'encadrement",
          description:
            "Cet employé est un responsable d'encadrement dans le département d'informatique",
        },
      });

      const id_responsable = await prisma.typeUtilisateur.findUnique({
        where: {
          nom: "Responsable",
        },
        select: {
          id: true,
        },
      });

      const employe = await prisma.employe.upsert({
        where: {
          prenom_nom: {
            nom: req.body.nom || "",
            prenom: req.body.prenom || "",
          },
        },
        update: {},
        create: {
          id_type_employe: type_employe.id,
          nom: req.body.nom,
          prenom: req.body.prenom,
        },
      });

      // Création du token.
      const token = SHA256(crypto.lib.WordArray.random(64)).toString();

      // Définit la date d'expiration du token
      let date_expiration = new Date();
      date_expiration.setDate(date_expiration.getDate() + 1);

      const utilisateur = await prisma.utilisateur.upsert({
        where: {
          no_employe: employe.no_employe,
        },
        update: {},
        create: {
          no_employe: Number(employe.no_employe),
          id_type_utilisateur: id_responsable.id,
          courriel: req.body.courriel,
          mdp: SHA256("ceciestunmotdepassepardefault").toString(),
          date_activation: today,
          date_desactivation: today,
          actif: Boolean(0),
          token: token,
          token_end_date: date_expiration,
        },
      });

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

    let link = "http://localhost:8080/password_modif/activate/" + token;
    let text = "Bienvenu(e) dans l\'équipe du Service d'encadrement. Votre compte a récemment été créé. Pour accéder aux services, veuillez activez votre compte en cliquant sur le lien suivant.\n\nLien : " + link;
  
    // Création du courriel
    var mailOptions = {
      from: process.env.EMAIL_ID,    
      to: "202045777@cegepsherbrooke.qc.ca", // to: req.body.courriel,
      subject: 'Activation de votre compte',
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

      res
        .status(200)
        .json({ message: "Le responsable d'encadrement à été créer" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updateSupervisorFormInfo(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const id = req.params.id;
      const actif = req.body.actif === "true" ? 1 : 0;

      const supervisor = await prisma.utilisateur.update({
        where: {
          id: Number(id),
        },
        data: {
          courriel: req.body.courriel,
          actif: Boolean(actif),
          date_desactivation: new Date(req.body.date_desactivation),
        },
      });

      const employe = await prisma.employe.update({
        where: {
          no_employe: supervisor.no_employe,
        },
        data: {
          prenom: req.body.prenom,
          nom: req.body.nom,
        },
      });

      res
        .status(200)
        .json({ message: "Le superviseur a été modifié avec succès" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getAllSupervisor(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const id_responsable = await prisma.typeUtilisateur.findUnique({
        where: {
          nom: "Responsable",
        },
        select: {
          id: true,
        },
      });

      const supervisor = await prisma.Utilisateur.findMany({
        where: {
          id_type_utilisateur: Number(id_responsable.id),
        },
        include: {
          employe: true,
        },
      });
      res.status(200).json(supervisor);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getPreviousSupervisor(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const id = req.params.id;

      const responsable = await prisma.typeUtilisateur.findMany({
        where: {
          nom: "Responsable",
        },
        select: {
          id: true,
        },
      });

      let prev = await prisma.Utilisateur.findMany({
        take: 1,
        where: {
          AND: [
            {
              id: {
                lt: Number(id),
              },
            },
            { id_type_utilisateur: responsable[0].id },
          ],
        },
        include: {
          employe: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      if (prev === undefined || prev.length == 0) {
        prev = await prisma.Utilisateur.findMany({
          take: -1,
          where: {
            id_type_utilisateur: responsable[0].id,
          },
          include: {
            employe: true,
          },
        });
      }
      res.status(200).json(prev);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getNextSupervisor(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const id = req.params.id;

      const responsable = await prisma.typeUtilisateur.findMany({
        where: {
          nom: "Responsable",
        },
        select: {
          id: true,
        },
      });

      let next = await prisma.Utilisateur.findMany({
        take: 1,
        where: {
          AND: [
            {
              id: {
                gt: Number(id),
              },
            },
            { id_type_utilisateur: responsable[0].id },
          ],
        },
        include: {
          employe: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      if (next === undefined || next.length == 0) {
        next = await prisma.Utilisateur.findMany({
          take: 1,
          where: {
            id_type_utilisateur: responsable[0].id,
          },
          include: {
            employe: true,
          },
        });
      }
      res.status(200).json(next);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updateSupervisorEmailAddress(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }
      
      const { id } = req.params;
      const { courriel } = req.body;

      await prisma.utilisateur.update({
        where: {
          id: Number(id),
        },
        data: {
          courriel: courriel,
        },
      });

      res.status(200).json({
        message: "Le courriel du superviseur à été mis à jour avec succès",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
