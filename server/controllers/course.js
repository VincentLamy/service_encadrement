const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Course {
  static async changeCourseName(req, res) {
    const { code, name } = req.body;
    try {
      await prisma.cours.update({
        where: {
          code: code,
        },
        data: {
          nom: name,  
        },
      });
      res.status(200).json({ message: 'Course name successfully updated.' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}