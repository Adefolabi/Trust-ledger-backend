const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const {
  getPaymentsLogs,
  getPayment,
  retryPayment,
} = require("../controllers/payment");
const router = express.Router();

router.get("/", getPaymentsLogs);
router.get("/:id", validateObjectId(), getPayment);
router.post("/:id/retry", validateObjectId(), retryPayment);
// router.post("/add/remove/:id", validateObjectId(), removeAdmin); // promote existing user

module.exports = router;
