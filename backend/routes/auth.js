const express = require("express");
const { loginUser } = require("../controllers/auth");
const router = express.Router();

router.post("/auth/login", loginUser);
// router.post("/auth/forgot-password", forgotPassword);

module.exports = router;
