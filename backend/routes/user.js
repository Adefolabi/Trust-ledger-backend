const express = require("express");
const { getUser, createUser } = require("../controllers/user");
const AUTH = require("../middleware/Auth");
const ADMIN = require("../middleware/Admin");
const router = express.Router();

router.get("/", getUser);
router.post("/admin/register", AUTH, ADMIN, createUser);
module.exports = router;
