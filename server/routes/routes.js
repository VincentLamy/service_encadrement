const express = require('express');
const router = express.Router();
const API = require("../controllers/api");
const Student = require("../controllers/student");
const StudentGroup = require("../controllers/studentgroup");

// Students
router.get("/getStudent/:no_etudiant", Student.getStudentById);
router.get("/student_list", Student.getAllStudent);

// Classes
router.get("/getStudentGroup/:no_etudiant", StudentGroup.getStudentGroupByStudent);

// Comments
router.get("/getComment/:no_etudiant", API.getCommentsByStudentId);

// Semesters
router.post("/addSession", API.addSession);
router.get("/getSession", API.getSession);

// Reports
router.post("/rapportEncadrement", API.addRapportEncadrement);

// Math form
router.post("/sondageMathematiques", API.addSondageMathematiques);

module.exports = router;