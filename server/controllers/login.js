const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

module.exports = class Responsable {
    static async login(req, res) {
        // try {
            const user = await prisma.utilisateur.findFirst({
                where: {
                    courriel: req.body.username,
                    mdp: req.body.password,
                },
                select: {
                    employe: {
                        select: {
                            prenom: true,
                            nom:    true,
                        }
                    },
                    type_utilisateur: {
                        select: {
                            nom: true
                        }
                    },
                    actif: true 
                },
            });  

            if (user) {
                jwt.sign({user: user}, 'key_se', (err, token) => {
                    res.status(200).json({user, token});
                });
            } else {
                res.status(400).json({message: 'Erreur lors de la connexion' });
            }   
        // } catch (error) {
        //     res.status(400).json({message: 'Erreur lors de la connexion' });
        // }
    }
};