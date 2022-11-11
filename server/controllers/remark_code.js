const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwtVerification = require('../modules/jwt_verification');

module.exports = class RemarkCode {
  static async getRemarkCode(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const remark_codes = await prisma.codeRemarque.findMany();
      res.status(200).json(remark_codes);
    } catch (error) {
      res.status(400).json({ message: 'La récupération des codes de remarque a échouée' });
    }
  }
}