const express = require("express");
const AUTH = require("../middleware/Auth");
const router = express.Router();
const {
  getRequest,
  getSingleRequest,
  approveRequest,
  rejectRequest,
  createRequest,
} = require("../controllers/request");
const validateObjectId = require("../middleware/validateObjectId");

// get rerquest

router.get("/", AUTH, getRequest);
router.get("/:id", AUTH, validateObjectId(), getSingleRequest);
router.post("/:id/approve", AUTH, validateObjectId(), approveRequest);
router.post("/:id/reject", AUTH, validateObjectId(), rejectRequest);
router.post("/", AUTH, createRequest);
module.exports = router;
