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

  static async updateSupervisorFormInfo(req, res) {
    try {
      const id = req.params.id;

      const supervisor = await prisma.utilisateur.update({
        where: {
          id: Number(id),
        },
        data: {
          courriel: req.body.courriel,
          mdp: req.body.mdp,
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