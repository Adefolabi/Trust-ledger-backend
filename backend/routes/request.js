const express = require("express");
const AUTH = require("../middleware/Auth");
const router = express.Router();
const {
  getRequest,
  getSingleRequest,
  approveRequest,
  rejectRequest,
  createRequest,
  forwardRequest,
} = require("../controllers/request");
const validateObjectId = require("../middleware/validateObjectId");
const ADMIN = require("../middleware/Admin");

// get rerquest

router.get("/", AUTH, getRequest);
router.get("/:id", AUTH, validateObjectId(), getSingleRequest);
router.post("/", AUTH, createRequest);

// finace and admin
router.post("/:id/approve", AUTH, ADMIN, validateObjectId(), approveRequest);
router.post("/:id/reject", AUTH, validateObjectId(), rejectRequest);
router.post("/:id/farward", AUTH, validateObjectId(), forwardRequest);
module.exports = router;
