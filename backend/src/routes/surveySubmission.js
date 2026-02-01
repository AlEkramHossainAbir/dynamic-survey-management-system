const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require("../middlewares/authMiddleware");
const { submitSurvey, getOfficerSurveys, getOfficerSurveyById } = require('../controllers/surveySubmissionController');


router.get('/', authenticateJWT, getOfficerSurveys);
router.get('/:id', authenticateJWT, getOfficerSurveyById);
router.post('/:id/submit', authenticateJWT, authorizeRole(['officer']), submitSurvey);
module.exports = router;