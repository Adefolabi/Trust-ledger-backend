const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");
const { hashFunction } = require("../utils/utils");

const getUser = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ user: users });
});
const getSingleUser = asyncHandler(async (req, res) => {
  const users = await User.findById(req.params.id);
  res.status(200).json({ user: users });
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
  res.status(200).json({ user: user });
});

const suspendUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const userExists = await User.findById(id);
  console.log(userExists);
  if (!userExists) return res.status(404).json({ message: "User not found" });

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      isActive: false,
    },
    { new: true },
  );
  res.status(200).json({ user: updatedUser });
});
const activateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const userExists = await User.findById(id);
  console.log(userExists);
  if (!userExists) return res.status(404).json({ message: "User not found" });

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      isActive: true,
    },
    { new: true },
  );
  res.status(200).json({ user: updatedUser });
});
module.exports = {
  getUser,
  createUser,
  getSingleUser,
  suspendUser,
  activateUser,
};
