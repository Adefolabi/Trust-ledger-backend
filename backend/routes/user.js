const express = require("express");
const {
  getUser,
  createUser,
  getSingleUser,
  suspendUser,
  activateUser,
} = require("../controllers/user");
const AUTH = require("../middleware/Auth");
const ADMIN = require("../middleware/Admin");
const { authorizeRoles } = require("../middleware/authorizeRoles");
const router = express.Router();

// get  users
router.get("/", AUTH, ADMIN, getUser);
router.get("/:id", AUTH, ADMIN, getSingleUser);

// create user
router.post("/", AUTH, ADMIN, createUser);
// activate and suspend user
router.post("/:id/suspend", AUTH, ADMIN, suspendUser);
router.post("/:id/activate", AUTH, ADMIN, activateUser);
module.exports = router;
