const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    budgetCap: {
      type: Number,
      required: true,
      min: 0,
    },
    spentToDate: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
