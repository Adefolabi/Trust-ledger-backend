const mongoose = require("mongoose");

const paymentLogSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    required: true,
  },
  providerTxId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  responseBody: {
    type: mongoose.Schema.Types.Mixed, // allows storing full response object
    required: false,
  },
  attempts: {
    type: Number,
    default: 1,
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaymentLog", paymentLogSchema);
