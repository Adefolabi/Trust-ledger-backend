const express = require("express");
const { loginUser, resetPassword } = require("../controllers/auth");
const AUTH = require("../middleware/Auth");
const router = express.Router();

router.post("/auth/login", loginUser);
router.post("/auth/resetPassword/:id", resetPassword);

module.exports = router;
