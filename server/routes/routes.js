const express = require('express');
const router = express.Router();
const Importation = require("../controllers/importation");
const Student = require("../controllers/student");
const Course = require("../controllers/course");
const Comment = require("../controllers/comment");
const RemarkCode = require("../controllers/remark_code");
const Supervisor = require("../controllers/supervisor");
const multer = require('multer');

let upload = multer().single();

// Students
router.get("/student_list", Student.getAllStudent);
router.get("/student_form/:no_etudiant", Student.getStudentFormInfo);
router.get("/previous_student_form/:no_etudiant", Student.getPreviousStudent);
router.get("/next_student_form/:no_etudiant", Student.getNextStudent);

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

// Courses
router.patch("/changeCourseName", Course.changeCourseName);

// Comments
router.post("/addComment", Comment.addComment);
router.patch("/editComment", Comment.editComment);

// Remark codes
router.get("/getRemarkCodes", RemarkCode.getRemarkCode);

// Reports
router.post("/rapportEncadrement", Importation.addRapportEncadrement);

// Math form
router.post("/sondageMathematiques", Importation.addSondageMathematiques);

// Internationals
router.post("/etudiantsInternationaux", Importation.addEtudiantsInternationaux);

module.exports = router;