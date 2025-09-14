const asyncHandler = require("express-async-handler");
const paymentLog = require("../models/paymentLog");

const getPaymentsLogs = asyncHandler(async (req, res) => {
  const payments = await paymentLog.find();
  res.status(200).json({ payments: payments });
});
const getPayment = asyncHandler(async (req, res) => {
  const payments = await paymentLog.find(req.params.id);
  res.status(200).json({ payments: payments });
});
const retryPayment = asyncHandler(async (req, res) => {
  res.status(200).json({ payments: "payments" });
});

module.exports = { getPaymentsLogs, getPayment, retryPayment };
