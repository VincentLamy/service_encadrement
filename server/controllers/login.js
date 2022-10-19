const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Responsable {
    static async get_user(req, res) {
        try {
            console.log(req.body);
            const user = await prisma.Utilisateur.findMany({
                where: {
                    courriel: req.body.username,
                    mdp: req.body.password,
                }
            });

            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}