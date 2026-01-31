const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require("../middlewares/authMiddleware");
const {createSurvey, getSurveyById, getSurveys, deleteSurvey, addFieldToSurvey, updateField, deleteField} = require('../controllers/surveyController');

router.post('/',authenticateJWT,authorizeRole(["admin"]), createSurvey);
router.get('/',authenticateJWT, getSurveys);
router.get('/:id',authenticateJWT,authorizeRole(["admin"]), getSurveyById);
router.delete('/:id',authenticateJWT,authorizeRole(["admin"]), deleteSurvey);
router.post('/:id/fields',authenticateJWT,authorizeRole(["admin"]), addFieldToSurvey);
router.put('/fields/:id',authenticateJWT,authorizeRole(["admin"]), updateField);
router.delete('/fields/:id',authenticateJWT,authorizeRole(["admin"]), deleteField);
module.exports = router;