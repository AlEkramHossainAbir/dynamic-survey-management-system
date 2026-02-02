const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validateMiddleware");
const {
  createSurveySchema,
  updateSurveySchema,
  addFieldSchema,
  updateFieldSchema,
} = require("../validators/surveyValidators");
const {createSurvey, getSurveyById, getSurveys, deleteSurvey, addFieldToSurvey, updateField, deleteField, getSubmissions, updateSurvey, reorderFields} = require('../controllers/surveyController');

router.post('/', authenticateJWT, authorizeRole(["admin"]), validate(createSurveySchema), createSurvey);
router.get('/', authenticateJWT, authorizeRole(["admin"]), getSurveys);
router.get('/:id', authenticateJWT, authorizeRole(["admin"]), getSurveyById);
router.put('/:id', authenticateJWT, authorizeRole(["admin"]), validate(updateSurveySchema), updateSurvey);
router.delete('/:id', authenticateJWT, authorizeRole(["admin"]), deleteSurvey);
router.get('/:id/submissions', authenticateJWT, authorizeRole(["admin"]), getSubmissions);
router.post('/:id/fields', authenticateJWT, authorizeRole(["admin"]), validate(addFieldSchema), addFieldToSurvey);
router.put('/:surveyId/fields/reorder', authenticateJWT, authorizeRole(["admin"]), reorderFields);
router.put('/fields/:id', authenticateJWT, authorizeRole(["admin"]), validate(updateFieldSchema), updateField);
router.delete('/fields/:id', authenticateJWT, authorizeRole(["admin"]), deleteField);
module.exports = router;