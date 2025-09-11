const express = require("express");
const { getUser, createUser } = require("../controllers/user");
const AUTH = require("../middleware/Auth");
const ADMIN = require("../middleware/Admin");
const { authorizeRoles } = require("../middleware/authorizeRoles");
const router = express.Router();

router.get("/", AUTH, ADMIN, getUser);
// router.get("/:id", AUTH, ADMIN, getUser);
router.post("/admin/register", AUTH, ADMIN, createUser);
// router.put("/admin/Update", AUTH, updateUser);
module.exports = router;
