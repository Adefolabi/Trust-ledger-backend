const express = require("express");
const AUTH = require("../middleware/Auth");
const {
  getNotification,
  createNotification,
  readNotification,
} = require("../controllers/notification");
const router = express.Router();

// create notification
router.get("/", AUTH, getNotification);
router.post("/", AUTH, createNotification);
router.put("/:id/read", AUTH, readNotification);
module.exports = router;
