const express = require("express");
const { login } = require("../controllers/authController");
const { validate } = require("../middlewares/validateMiddleware");
const { loginSchema } = require("../validators/surveyValidators");

const router = express.Router();

// POST /auth/login
router.post("/login", validate(loginSchema), login);

module.exports = router;
