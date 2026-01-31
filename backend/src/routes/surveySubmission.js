const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require("../middlewares/authMiddleware");
const { submitSurvey, getOfficerSurveys } = require('../controllers/surveySubmissionController');


router.get('/', authenticateJWT, getOfficerSurveys);
router.post('/:id/submit', authenticateJWT, authorizeRole(['officer']), submitSurvey);
module.exports = router;