const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Supervisor {
  static async getSupervisorFormInfo(req, res) {
    // try {
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
  } catch(error) {
    res.status(404).json({ message: error.message });
  }

  // create a supervisor
  static async addSupervisor(req, res) {
    //try {
      const today =  new Date();

      // Insert Type employé
      const type_employe = await prisma.typeEmploye.upsert({
        where: { id: 2 || 0 },
        update: {},
        create: {
            id: 2,
            nom: 'Responsable d\'encadrement',
            description: 'Cet employé est un responsable d\'encadrement dans le département d\'informatique',
        },
      });

      const id_responsable = await prisma.typeUtilisateur.findUnique({
        where: {
          nom: "Responsable"
        },
        select: {
          id: true
        },
      });

      const employe = await prisma.employe.upsert({
        where: {
          prenom_nom: {
              nom: req.body.nom || '',
              prenom: req.body.prenom || '',
          }
        },
        update: {},
        create: {
            id_type_employe: type_employe.id,
            nom: req.body.nom,
            prenom: req.body.prenom,
        },
      });

      const utilisateur = await prisma.utilisateur.upsert({
        where: {
          no_employe: employe.no_employe,
        },
        update: {},
        create: {
            no_employe: Number(employe.no_employe),
            id_type_utilisateur: id_responsable.id,
            courriel: req.body.courriel,
            mdp: "ceciestunmotdepassepardefault",
            date_activation: today,
            date_desactivation: today,
            actif: Boolean(0),

        },
      });

      res.status(200).json({ message: 'Le responsable d\'encadrement à été créer' });
    } //catch (error) {
      //res.status(404).json({ message: error.message });
    //}
  

  static async updateSupervisorFormInfo(req, res) {
    try {
      const id = req.params.id;
      const actif = req.body.actif === 'true' ? 1 : 0;

      const supervisor = await prisma.utilisateur.update({
        where: {
          id: Number(id),
        },
        data: {
          courriel: req.body.courriel,
          actif: Boolean(actif),
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

      res.status(200).json({ message: 'Le superviseur a été modifié avec succès' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getAllSupervisor(req, res) {
    //try {

      const id_responsable = await prisma.typeUtilisateur.findUnique({
        where: {
          nom: "Responsable"
        },
        select: {
          id: true
        },

      });

      const supervisor = await prisma.Utilisateur.findMany({
        where: {
          id_type_utilisateur : Number(id_responsable.id)
        },
        include: {
          employe: true,
          
        },
      });
      res.status(200).json(supervisor);
      
    //} catch (error) {
      //res.status(404).json({ message: error.message });
    //}
  }
};