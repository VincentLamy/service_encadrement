const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = class API {
    // Hello World
    static async HelloWorld(req, res) {
        res.send("Hello from API");
    }

    static async addSession(req, res) {
        const { code } = req.body;
        const session = await prisma.session.create({
            data: {
                code: code,
            },
        });
        res.json(session);
    };

    static async getSession(req, res) {
        const sessions = await prisma.session.findMany();
        res.json(sessions);
    };
};