const express = require('express');
const router = express.Router();
const Importation = require("../controllers/importation");
const Student = require("../controllers/student");
const Login = require("../controllers/login");
const Course = require("../controllers/course");
const Comment = require("../controllers/comment");
const RemarkCode = require("../controllers/remark_code");
const Supervisor = require("../controllers/supervisor");
const multer = require('multer');

let upload = multer().single();

// Students
router.get("/student_list",                         verifyToken, Student.getAllStudent);
router.get("/student_form/:no_etudiant",            verifyToken, Student.getStudentFormInfo);
router.get("/previous_student_form/:no_etudiant",   verifyToken, Student.getPreviousStudent);
router.get("/next_student_form/:no_etudiant",       verifyToken, Student.getNextStudent);
router.patch("/flagStudent/:no_etudiant",           verifyToken, Student.flagStudent);

// Supervisor
router.get("/supervisor_list",                      verifyToken, Supervisor.getAllSupervisor);
router.get("/supervisor_form/:id",                  verifyToken, Supervisor.getSupervisorFormInfo);
router.patch("/supervisor_form/:id",        upload, verifyToken, Supervisor.updateSupervisorFormInfo);
router.post("/add_supervisor",              upload, verifyToken, Supervisor.addSupervisor);
router.get("/previous_supervisor_form/:id", upload, verifyToken, Supervisor.getPreviousSupervisor);
router.get("/next_supervisor_form/:id",     upload, verifyToken, Supervisor.getNextSupervisor);
router.patch("/make_supervisor_admin/:id",  upload, verifyToken, Supervisor.sendEmailNewAdmin);

// Courses
router.get("/course_list",        verifyToken, Course.getAllCourse);
router.patch("/changeCourseName", verifyToken, Course.changeCourseName);

// Comments
router.post("/addComment",    verifyToken, Comment.addComment);
router.patch("/editComment",  verifyToken, Comment.editComment);

// Remark codes
router.get("/getRemarkCodes", verifyToken, RemarkCode.getRemarkCode);

// Rapports
router.post("/oneRapportEncadrement",     verifyToken, Importation.addOneRapportEncadrement);
router.delete("/removeInactiveStudents",  verifyToken, Importation.removeInactiveStudents);
router.get("/sessions",                   verifyToken, Importation.getAllSessions);

// Math form
router.post("/oneSondageMathematiques", verifyToken, Importation.addOneSondageMathematiques);

// Internationals
router.post("/oneEtudiantsInternationaux", verifyToken, Importation.addOneEtudiantsInternationaux);

// Login
router.post("/login",                   Login.login);
router.post("/recover_password",        Login.recover_password);
router.patch("/password/:type/:token",  Login.password_modif);


// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify token function
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader === 'undefined') {
      // Forbidden
      res.status(403).json();
      return;
  }

  // Split at the space
  const bearer = bearerHeader.split(' ');
  // Get token from array
  const bearerToken = bearer[1];
  // Set the token
  req.token = bearerToken;
  //Next middleware
  next();
}


module.exports = router;