const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class RemarkCode {
  static async getRemarkCode(req, res) {
    const remark_codes = await prisma.codeRemarque.findMany();
    res.json(remark_codes);
  }
}