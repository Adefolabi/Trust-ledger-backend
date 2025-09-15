const asyncHandler = require("express-async-handler");
const { Request } = require("../models/request");
const { default: Notification } = require("../models/notification");

const createRequest = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const request = new Request({
    requesterId: userId,
    requesterAddress: req.body.requesterAddress,
    departmentId: req.body.departmentId,
    purpose: req.body.purpose,
    recipient: req.body.recipient,
    amount: req.body.amount,
    status: "PENDING_FM",
  });

  await request.save();

  // Notify Finance
  await Notification.create({
    targetRoles: ["finance"],
    type: "New Budget Request",
    message: `New request created: ${request.purpose} (${request.amount})`,
    data: { requestId: request._id },
  });

  res.status(201).json({ message: request });
});

const forwardRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requestExists = await Request.findById(id);

  if (!requestExists)
    return res.status(404).json({ message: "request not found" });

  const updatedRequest = await Request.findByIdAndUpdate(
    id,
    { status: "PENDING_ADMIN" },
    { new: true },
  );

  // Notify Admin
  await Notification.create({
    targetRoles: ["admin"],
    type: "Admin Approval Needed",
    message: `Request forwarded: ${requestExists.purpose} (${requestExists.amount})`,
    data: { requestId: updatedRequest._id },
  });

  // Notify Staff
  await Notification.create({
    userIds: [requestExists.requesterId],
    type: "Request Update",
    message: `Your request has been forwarded to Admin`,
    data: { requestId: updatedRequest._id },
  });

  res
    .status(200)
    .json({ message: "Request forwarded to Admin", updatedRequest });
});

const approveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requestExists = await Request.findById(id);

  if (!requestExists)
    return res.status(404).json({ message: "request not found" });

  const updatedRequest = await Request.findByIdAndUpdate(
    id,
    { status: "APPROVED" },
    { new: true },
  );

  // Notify Staff
  await Notification.create({
    userIds: [requestExists.requesterId],
    type: "Request Approved",
    message: `Your request "${requestExists.purpose}" was approved `,
    data: { requestId: updatedRequest._id },
  });

  res.status(200).json({ updatedRequest });
});

const rejectRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requestExists = await Request.findById(id);

  if (!requestExists)
    return res.status(404).json({ message: "request not found" });

  const updatedRequest = await Request.findByIdAndUpdate(
    id,
    { status: "REJECTED", notes: req.body.notes || "" },
    { new: true },
  );

  // Notify Staff
  await Notification.create({
    userIds: [requestExists.requesterId],
    type: "Request Rejected",
    message: `Your request "${requestExists.purpose}" was rejected `,
    data: { requestId: updatedRequest._id },
  });

  res.status(200).json({ updatedRequest });
});
const getRequest = asyncHandler(async (req, res) => {
  const role = req.user.role;
  let requests;
  if (role === "finance") {
    requests = await Request.find({ status: "PENDING_FM" });
  } else if (role === "admin") {
    requests = await Request.find({ status: "PENDING_ADMIN" });
  } else {
    requests = await Request.find({ staffId: req.user.id });
  }
  res.status(200).json({ message: requests });
});
const getSingleRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  res.status(200).json({ message: request });
});
module.exports = {
  getRequest,
  createRequest,
  getSingleRequest,
  rejectRequest,
  approveRequest,
  forwardRequest,
};
