const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");
const { hashFunction, logEvent } = require("../utils/utils");
const PASSWORD = process.env.PASSWORD;
const { createEncryptedWallet, getLogs } = require("../utils/wallet");
const { getWalletForUser, connect } = require("../smartContract/connection");

const getAdmin = asyncHandler(async (req, res) => {
  let receipt, logs, contract;
  // get all admins
  const users = await User.find({ role: "admin" }).select("-password");
  try {
    // get wallet on chain
    const adminWallet = await getWalletForUser(req.user);
    contract = await connect(adminWallet);
    const adminList = await contract.getAdmins();
    console.log(adminList);
  } catch (error) {
    console.error("Blockchain error:", error);
    res.status(500).json({
      message: "Error adding admin on blockchain",
      error: error.message,
    });
  }
  res.status(200).json({ message: users });
});

const addAdmin = asyncHandler(async (req, res) => {
  let receipt, logs, contract, updatedUser;
  contract;
  const { id } = req.params;
  const admin = await User.findById(req.user.id);
  const user = await User.findById(id);
  const wallet = await createEncryptedWallet(PASSWORD);

  if (!id) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // create new admin
    const hashedPassword = await hashFunction(req.body.password);
    try {
      // add wallet on chain
      const adminWallet = await getWalletForUser(admin);
      contract = await connect(adminWallet);
      const tx = await contract.addAdmin(wallet.address);
      receipt = await tx.wait();
      logs = getLogs(receipt, contract);
    } catch (error) {
      console.error("Blockchain error:", error);
      res.status(500).json({
        message: "Error adding admin on blockchain",
        error: error.message,
      });
    }

    // save admin to db
    const newAdmin = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: "admin",
      isActive: req.body.isActive ?? true,
      createdByAdminId: admin._id,
      walletAddress: wallet.address,
      encryptedPrivateKey: wallet.privateKey,
    });
    await newAdmin.save();
    return res.status(201).json({ user: newAdmin });
  }

  // promote existing user
  try {
    // add wallet on chain
    const adminWallet = await getWalletForUser(admin);
    contract = await connect(adminWallet);
    const isTargetAdmin = await contract.isAdmin(user.walletAddress);
    console.log("Target is admin:", isTargetAdmin);
    if (isTargetAdmin) {
      return res
        .status(400)
        .json({ message: "User already is  an admin on blockchain" });
    }
    const tx = await contract.addAdmin(user.walletAddress);
    receipt = await tx.wait();
    logs = getLogs(receipt, contract);
  } catch (error) {
    console.error("Blockchain error:", error);
    res.status(500).json({
      message: "Error adding admin on blockchain",
      error: error.message,
    });
  }
  // if existing user has no wallet, add wallet details
  if (!user.walletAddress && !user.encryptedPrivateKey) {
    updatedUser = await User.findByIdAndUpdate(
      id,
      {
        role: "admin",
        walletAddress: wallet.address,
        encryptedPrivateKey: wallet.privateKey,
      },
      { new: true },
    );
  }
  updatedUser = await User.findByIdAndUpdate(
    id,
    {
      role: "admin",
    },
    { new: true },
  );
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  const isTargetAdmin = await contract.isAdmin(user.walletAddress);
  console.log("Target is admin:", isTargetAdmin);
  // store event logs
  const eventlog = await logEvent({
    name: logs.name,
    admin,
    contract,
    receipt,
    logs,
  });

  res.status(200).json({ user: updatedUser });
});
const removeAdmin = asyncHandler(async (req, res) => {
  let receipt, logs, contract;
  const { id } = req.params;
  const user = await User.findById(id);
  const admin = await User.findById(req.user.id);

  const wallet = await user.walletAddress;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role: "hod" },
    { new: true },
  );
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    // remove wallet on chain
    const adminWallet = await getWalletForUser(admin);
    contract = await connect(adminWallet);
    const isTargetAdmin = await contract.isAdmin(user.walletAddress);
    console.log("Target is admin:", isTargetAdmin);
    if (!isTargetAdmin) {
      return res
        .status(400)
        .json({ message: "User is not an admin on blockchain" });
    }
    const tx = await contract.removeAdmin(wallet);
    receipt = await tx.wait();
    logs = getLogs(receipt, contract);
  } catch (error) {
    console.error("Blockchain error:", error);
    res.status(500).json({
      message: "Error removing admin on blockchain",
      error: error.message,
    });
  }
  // store event logs
  const eventlog = await logEvent({
    name: logs.name,
    admin,
    contract,
    receipt,
    logs,
  });

  res.status(200).json({ user: updatedUser });
});

module.exports = {
  getAdmin,
  addAdmin,
  removeAdmin,
};
