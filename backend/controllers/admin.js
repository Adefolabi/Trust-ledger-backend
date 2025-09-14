const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");
const { hashFunction } = require("../utils/utils");

const getAdmin = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "admin" }).select("-password");
  res.status(200).json({ message: users });
});

const addAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    // create new admin
    const hashedPassword = await hashFunction(req.body.password);
    const admin = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: "admin",
      department: req.body.department,
      isActive: req.body.isActive ?? true,
      createdByAdminId: req.user.id,
    });
    await admin.save();
    return res.status(201).json({ user: admin });
  }

  // promote existing user
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role: "admin" },
    { new: true },
  );
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user: updatedUser });
});
const removeAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role: "hod" },
    { new: true },
  );
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user: updatedUser });
});

module.exports = {
  getAdmin,
  addAdmin,
  removeAdmin,
};
