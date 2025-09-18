const asyncHandler = require("express-async-handler");
const { Request } = require("../models/request");
const Notification = require("../models/notification");
const { getLogs } = require("../utils/wallet");
const { User } = require("../models/user");
const { connect, getWalletForUser } = require("../smartContract/connection");
const Wallet = require("../models/wallet");

const {
  PENDING_FM,
  PENDING_ADMIN,
  APPROVED,
  REJECTED,
} = require("../utils/constant");
const Event = require("../models/eventLog");
const ethers = require("ethers");
const { logEvent } = require("../utils/utils");
const { request } = require("express");
const PASSWORD = process.env.PASSWORD;

const createRequest = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const request = new Request({
    requesterId: userId,
    requesterAddress: req.body.requesterAddress,
    departmentId: req.body.departmentId,
    purpose: req.body.purpose,
    recipient: req.body.recipient,
    amount: req.body.amount,
    status: PENDING_FM,
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
  const user = req.user;
  const requestExists = await Request.findById(id);
  // check for request
  if (!requestExists)
    return res.status(404).json({ message: "request not found" });
  if (!ethers.isAddress(requestExists.requesterAddress)) {
    throw new Error("Invalid Ethereum address for requester");
  }
  const financeWallet = await Wallet.findOne({ name: "financewallet" });
  // check finance wallet
  if (!financeWallet || !financeWallet.encryptedPrivateKey) {
    return res
      .status(400)
      .json({ message: "Finance wallet not found or invalid" });
  }

  const wallet = await getWalletForUser(req.user);
  // connect wallet to contract
  const contract = await connect(wallet);
  try {
    // send trancation onchain
    const tx = await contract.submitRequest(
      requestExists.purpose,
      requestExists.requesterAddress,
      requestExists.amount,
    );
    const receipt = await tx.wait();
    // console.log(receipt);
    const logs = getLogs(receipt, contract);
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status: PENDING_ADMIN, onChainRequestId: logs.args.id.toString() },
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

    // store event logs
    const eventlog = await logEvent({
      name: logs.name,
      request: requestExists,
      user,
      wallet,
      contract,
      receipt,
      logs,
    });
    res
      .status(200)
      .json({ message: "Request forwarded to Admin", updatedRequest });
  } catch (error) {
    console.error("Blockchain error:", error.message);
    return res.status(500).json({ message: "Blockchain transaction failed" });
  }
});
// approve request
const approveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requestExists = await Request.findById(id);
  const user = await User.findById(req.user.id);
  // check for request

  if (!requestExists) {
    return res.status(404).json({ message: "Request not found" });
  }
  // check for user wallet

  if (
    !user.encryptedPrivateKey ||
    typeof user.encryptedPrivateKey !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "Invalid or missing encrypted wallet" });
  }
  // check for onChain id
  if (!requestExists.onChainRequestId) {
    return res
      .status(400)
      .json({ message: "Request not yet forwarded to blockchain" });
  }
  const wallet = await getWalletForUser(req.user);
  // connect wallet to contract
  const contract = await connect(wallet);
  // console.log(contract);
  // console.log(contract.interface.fragments.map((f) => f.name));
  try {
    // send transaction on chain
    const tx = await contract.approveRequest(requestExists.onChainRequestId);
    const receipt = await tx.wait();
    const logs = getLogs(receipt, contract);
    // update request
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      {
        status: APPROVED,
        onChainTxHash: receipt.hash,
        onChainBlock: receipt.blockNumber,
      },
      { new: true },
    );

    // Notify Staff
    await Notification.create({
      userIds: [requestExists.requesterId],
      type: "Request Approved",
      message: `Your request "${requestExists.purpose}" was approved `,
      data: { requestId: updatedRequest._id },
    });
    // store event logs
    const eventlog = await logEvent({
      name: logs.name,
      request: requestExists,
      user,
      wallet,
      contract,
      receipt,
      logs,
    });

    res.status(200).json({ updatedRequest });
  } catch (error) {
    console.error("Blockchain error:", error.message);
    return res.status(500).json({ message: "Blockchain transaction failed" });
  }
});
// reject request
const rejectRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requestExists = await Request.findById(id);
  const user = await User.findById(req.user.id);
  // check for request
  if (!requestExists) {
    return res.status(404).json({ message: "Request not found" });
  }
  // check for user wallet
  if (
    !user.encryptedPrivateKey ||
    typeof user.encryptedPrivateKey !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "Invalid or missing encrypted wallet" });
  }
  // check for onChain id
  if (!requestExists.onChainRequestId) {
    return res
      .status(400)
      .json({ message: "Request not yet forwarded to blockchain" });
  }
  const wallet = await getWalletForUser(req.user);
  // connect wallet to contract
  const contract = await connect(wallet);
  try {
    // send transaction onchain
    const tx = await contract.rejectRequest(requestExists.onChainRequestId);
    const receipt = await tx.wait();
    const logs = getLogs(receipt, contract);
    // Update request
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      {
        status: REJECTED,
        notes: req.body.notes || "",
        onChainTxHash: receipt.hash,
        onChainBlock: receipt.blockNumber,
      },
      { new: true },
    );

    // Notify Staff
    await Notification.create({
      userIds: [requestExists.requesterId],
      type: "Request Rejected",
      message: `Your request "${requestExists.purpose}" was rejected `,
      data: { requestId: updatedRequest._id },
    });
    // store event logs
    const eventlog = await logEvent({
      name: logs.name,
      request: requestExists,
      user,
      wallet,
      contract,
      receipt,
      logs,
    });
    res.status(200).json({ updatedRequest });
  } catch (error) {
    console.error("Blockchain error:", error.message);
    return res.status(500).json({ message: "Blockchain transaction failed" });
  }
});
const getRequest = asyncHandler(async (req, res) => {
  const role = req.user.role;
  let requests;
  if (role === "finance") {
    requests = await Request.find({ status: PENDING_FM });
  } else if (role === "admin") {
    requests = await Request.find({ status: PENDING_ADMIN });
  } else {
    requests = await Request.find({ staffId: req.user.id });
  }
  res.status(200).json({ request: requests });
});
const getSingleRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  res.status(200).json({ request: request });
});
const getHistoryRequest = asyncHandler(async (req, res) => {
  const request = await Request.find();
  res.status(200).json({ request: request });
});
module.exports = {
  getRequest,
  createRequest,
  getHistoryRequest,
  getSingleRequest,
  rejectRequest,
  approveRequest,
  forwardRequest,
};
