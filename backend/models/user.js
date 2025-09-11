// models/User.js
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
      enum: ["hod", "admin", "finance", "hr"],
      default: "user",
    },
    department: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user creator is required"],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
