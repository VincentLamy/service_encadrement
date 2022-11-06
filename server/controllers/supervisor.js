const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Student {
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
};