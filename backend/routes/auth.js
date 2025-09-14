const express = require("express");
const { loginUser, resetPassword } = require("../controllers/auth");
const AUTH = require("../middleware/Auth");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

router.post("/auth/login", loginUser);
router.post("/auth/resetPassword/:id", validateObjectId(), resetPassword);

module.exports = router;
