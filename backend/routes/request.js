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

// get rerquest

router.get("/", AUTH, getRequest);
router.get("/:id", AUTH, getSingleRequest);
router.post("/:id/approve", AUTH, approveRequest);
router.post("/:id/reject", AUTH, rejectRequest);
router.post("/", AUTH, createRequest);
module.exports = router;
