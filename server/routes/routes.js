const express = require('express');
const router = express.Router();
const API = require("../controllers/api");
const Student = require("../controllers/student");
const Course = require("../controllers/course");
const Comment = require("../controllers/comment");
const RemarkCode = require("../controllers/remark_code");

// Students
router.get("/student_list", Student.getAllStudent);
router.get("/student_form/:no_etudiant", Student.getStudentFormInfo);

// Semesters
router.post("/addSession", API.addSession);
router.get("/getSession", API.getSession);

// Courses
router.patch("/changeCourseName", Course.changeCourseName);

// Comments
router.post("/addComment", Comment.addComment);
router.patch("/editComment", Comment.editComment);

// Remark codes
router.get("/getRemarkCodes", RemarkCode.getRemarkCode);

// Reports
router.post("/rapportEncadrement", API.addRapportEncadrement);

// Math form
router.post("/sondageMathematiques", API.addSondageMathematiques);

// Internationals
router.post("/etudiantsInternationaux", API.addEtudiantsInternationaux);

module.exports = router;