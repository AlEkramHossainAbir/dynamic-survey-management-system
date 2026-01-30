const express = require("express");
const router = express.Router();
const { showAllUsers } = require("../controllers/userController");

router.get("/", showAllUsers);

module.exports = router;