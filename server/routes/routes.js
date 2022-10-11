const express = require('express');
const router = express.Router();
const API = require("../controllers/api");
const Student = require("../controllers/student");

// Students
router.get("/student_list", Student.getAllStudent);
router.get("/student_form/:no_etudiant", Student.getStudentFormInfo);

// Semesters
router.post("/addSession", API.addSession);
router.get("/getSession", API.getSession);

// Reports
router.post("/rapportEncadrement", API.addRapportEncadrement);

// Math form
router.post("/sondageMathematiques", API.addSondageMathematiques);

// International students
router.post("/etudiantsInternationaux", API.addEtudiantsInternationaux);

module.exports = router;