const express = require('express');
const router = express.Router();
const API = require("../controllers/api");

router.get("/", API.HelloWorld);
router.post("/addSession", API.addSession);
router.get("/getSession", API.getSession);
router.post("/rapportEncadrement", API.addRapportEncadrement);
router.post("/sondageMathematiques", API.addSondageMathematiques);
router.post("/etudiantsInternationaux", API.addEtudiantsInternationaux);
module.exports = router;