const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const { randomnPassword, hashFunction } = require("../utils/utils");

const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN;

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    SECRET_KEY,
    { expiresIn: EXPIRES_IN },
  );

  res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
    },
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const userExists = await User.findById(id);
  console.log(userExists);
  if (!userExists) return res.status(404).json({ message: "User not found" });

  const tempPassword = randomnPassword();
  const hashedTempPassword = await hashFunction(tempPassword);
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      password: hashedTempPassword,
    },
    { new: true },
  );
  res.status(200).json({ user: updatedUser });
});

module.exports = { loginUser, resetPassword };
