const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validateMiddleware");
const { submitSurveySchema } = require("../validators/surveyValidators");
const { submitSurvey, getOfficerSurveys, getOfficerSurveyById } = require('../controllers/surveySubmissionController');


router.get('/', authenticateJWT, authorizeRole(['officer']), getOfficerSurveys);
router.get('/:id', authenticateJWT, authorizeRole(['officer']), getOfficerSurveyById);
router.post('/:id/submit', authenticateJWT, authorizeRole(['officer']), validate(submitSurveySchema), submitSurvey);
module.exports = router;