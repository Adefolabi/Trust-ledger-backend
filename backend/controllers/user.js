const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");
const { hashFunction } = require("../utils/utils");
const getUser = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ message: users });
});
const createUser = asyncHandler(async (req, res) => {
  // hash password
  const hashedpassword = await hashFunction(req.body.password);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedpassword,
    role: req.body.role,
    department: req.body.department,
    isActive: req.body.isActive,
    createdByAdminId: req.user.id,
  });
  await user.save();
  res.status(200).json({ message: user });
});

module.exports = { getUser, createUser };
