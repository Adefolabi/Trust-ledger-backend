const express = require("express");
const { getAdmin, addAdmin, removeAdmin } = require("../controllers/admin");
const validateObjectId = require("../middleware/validateObjectId");
const AUTH = require("../middleware/Auth");
const ADMIN = require("../middleware/Admin");
const router = express.Router();

router.get("/", AUTH, ADMIN, getAdmin);
router.post("/add", AUTH, ADMIN, addAdmin); // create new admin
router.post("/add/:id", AUTH, ADMIN, validateObjectId(), addAdmin); // promote existing user
router.post("/add/remove/:id", AUTH, ADMIN, validateObjectId(), removeAdmin); // promote existing user

module.exports = router;
