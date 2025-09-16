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
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

// get  users
router.get("/", AUTH, ADMIN, getUser);
router.get("/:id", AUTH, ADMIN, validateObjectId(), getSingleUser);

// create user
router.post(
  "/",
  AUTH,
  authorizeRoles(["admin","hr"]),
  validateObjectId(),
  createUser,
);
// activate and suspend user
router.post("/:id/suspend", AUTH, ADMIN, validateObjectId(), suspendUser);
router.post("/:id/activate", AUTH, ADMIN, validateObjectId(), activateUser);
module.exports = router;
