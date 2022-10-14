const express = require('express');
const router = express.Router();
const API = require("../controllers/api");
const Student = require("../controllers/student");
const Supervisor = require("../controllers/supervisor");
const multer = require('multer');

let upload = multer().single();

// Students
router.get("/student_list", Student.getAllStudent);
router.get("/student_form/:no_etudiant", Student.getStudentFormInfo);

// Supervisor
router.get("/supervisor_list", Supervisor.getAllSupervisor);
router.get("/supervisor_form/:id", Supervisor.getSupervisorFormInfo);
router.patch("/supervisor_form/:id", upload, Supervisor.updateSupervisorFormInfo);

// Semesters
router.post("/addSession", API.addSession);
router.get("/getSession", API.getSession);

// Reports
router.post("/rapportEncadrement", API.addRapportEncadrement);

// Math form
router.post("/sondageMathematiques", API.addSondageMathematiques);

// Internationals
router.post("/etudiantsInternationaux", API.addEtudiantsInternationaux);

module.exports = router;