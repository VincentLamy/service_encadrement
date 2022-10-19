const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Responsable {
    static async get_user(req, res) {
        try {
            const user = await prisma.utilisateur.findMany({
                where: {
                    courriel: req.body.username,
                    mdp: req.body.password,
                },
                select: {
                    employe: {
                        select: {
                            prenom: true,
                            nom:    true,
                            Groupe: true,
                        }
                    },
                    type_utilisateur: {
                        select: {
                            nom: true
                        }
                    },
                    actif: true 
                },
            })

            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}