const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = class Student {
    static async getAllStudent(req, res) {
       try {
            const students = await prisma.Etudiant.findMany({});        
            res.status(200).json(students);
       } catch (error) {
            res.status(404).json({ message: error.message });
       }
    };
};