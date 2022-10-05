const express = require('express');
const router = express.Router();
const API = require("../controllers/api");
const Student = require("../controllers/student");

// router.get("/", API.HelloWorld);
router.post("/addSession", API.addSession);
router.get("/getSession", API.getSession);
router.post("/rapportEncadrement", API.addRapportEncadrement);
router.get("/student_list", Student.getAllStudent);
router.post("/sondageMathematiques", API.addSondageMathematiques);
router.post("/etudiantsInternationaux", API.addEtudiantsInternationaux);
module.exports = router;