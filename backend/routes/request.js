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
  getHistoryRequest,
} = require("../controllers/request");
const validateObjectId = require("../middleware/validateObjectId");
const ADMIN = require("../middleware/Admin");

// get rerquest

router.get("/", AUTH, getRequest);
router.get("/history", AUTH, getHistoryRequest);
router.get("/:id", AUTH, validateObjectId(), getSingleRequest);
router.post("/", AUTH, createRequest);

// finace and admin
router.post("/:id/approve", AUTH, ADMIN, validateObjectId(), approveRequest);
router.post("/:id/reject", AUTH, validateObjectId(), rejectRequest);
router.post("/:id/forward", AUTH, validateObjectId(), forwardRequest);
module.exports = router;
