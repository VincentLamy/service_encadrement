const express = require('express');
const router = express.Router();
const Importation = require("../controllers/importation");
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
router.post("/add_supervisor", upload, Supervisor.addSupervisor);
router.get("/previous_supervisor_form/:id", upload, Supervisor.getPreviousSupervisor);
router.get("/next_supervisor_form/:id", upload, Supervisor.getNextSupervisor);

// Semesters
router.post("/addSession", Importation.addSession);
router.get("/getSession", Importation.getSession);

// Reports
router.post("/rapportEncadrement", Importation.addRapportEncadrement);

// Math form
router.post("/sondageMathematiques", Importation.addSondageMathematiques);

// Internationals
router.post("/etudiantsInternationaux", Importation.addEtudiantsInternationaux);

module.exports = router;