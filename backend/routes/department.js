const express = require("express");
const AUTH = require("../middleware/Auth");
const validateObjectId = require("../middleware/validateObjectId");
const ADMIN = require("../middleware/Admin");
const {
  getDepartment,
  createDepartment,
} = require("../controllers/department");
const router = express.Router();

router.get("/", getDepartment);
router.post("/", AUTH, ADMIN, createDepartment);

module.exports = router;
