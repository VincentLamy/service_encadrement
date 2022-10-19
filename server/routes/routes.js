const express = require('express');
const router = express.Router();
const API = require("../controllers/api");
const Student = require("../controllers/student");
const Login = require("../controllers/login");

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

// Internationals
router.post("/etudiantsInternationaux", API.addEtudiantsInternationaux);

// Login
router.post("/get_user", Login.get_user);



module.exports = router;