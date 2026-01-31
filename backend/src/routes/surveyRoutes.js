const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require("../middlewares/authMiddleware");
const {createSurvey, getSurveyById, getSurveys, deleteSurvey, addFieldToSurvey, updateField, deleteField} = require('../controllers/surveyController');

router.post('/',authenticateJWT,authorizeRole(["admin"]), createSurvey);
router.get('/',authenticateJWT, getSurveys);
router.get('/:id', getSurveyById);
router.delete('/:id', deleteSurvey);
router.post('/:id/fields', addFieldToSurvey);
router.put('/fields/:id', updateField);
router.delete('/fields/:id', deleteField);

module.exports = router;