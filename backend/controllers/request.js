const asyncHandler = require("express-async-handler");
const { Request } = require("../models/request");

const getRequest = asyncHandler(async (req, res) => {
  const request = await Request.find();
  res.status(200).json({ message: request });
});
const getSingleRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  res.status(200).json({ message: request });
});

const createRequest = asyncHandler(async (req, res) => {
  const request = new Request({
    requesterId: req.body.requesterId,
    requesterAddress: req.body.requesterAddress,
    departmentId: req.body.departmentId,
    purpose: req.body.purpose,
    recipient: req.body.recipient,
    amount: req.body.amount,
    status: req.body.status || "PENDING",
    approvedById: req.body.approvedById || null,
    approvedAt: req.body.approvedAt || null,
    onChainTxHash: req.body.onChainTxHash || null,
    onChainBlock: req.body.onChainBlock || null,
    notes: req.body.notes || "",
  });
  await request.save();
  res.status(200).json({ message: request });
});
const approveRequest = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const requestExists = await Request.findById(id);
  if (!requestExists)
    return res.status(404).json({ message: "request not found" });

  const updatedRequest = await Request.findByIdAndUpdate(
    id,
    {
      status: "APPROVED",
    },
    { new: true },
  );
  res.status(200).json({ user: updatedRequest });
});
const rejectRequest = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const requestExists = await Request.findById(id);
  if (!requestExists)
    return res.status(404).json({ message: "request not found" });

  const updatedRequest = await Request.findByIdAndUpdate(
    id,
    {
      status: "REJECTED",
    },
    { new: true },
  );
  res.status(200).json({ user: updatedRequest });
});

module.exports = {
  getRequest,
  createRequest,
  getSingleRequest,
  rejectRequest,
  approveRequest,
};
