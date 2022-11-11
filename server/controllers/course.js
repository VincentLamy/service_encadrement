const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwtVerification = require("../modules/jwt_verification");

module.exports = class Course {
  static async getAllCourse(req, res) {
    try {
      const courses = await prisma.Cours.findMany({
        include: {
          campus: true,
        },
      });

      res.json(courses);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async changeCourseName(req, res) {
    try {
      if (jwtVerification(req.token) === false) {
        res.status(403).json();
        return;
      }

      const { code, name } = req.body;

      await prisma.cours.update({
        where: {
          code: code,
        },
        data: {
          nom: name,
        },
      });
      res.status(200).json({ message: "Course name successfully updated." });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
