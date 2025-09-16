const asyncHandler = require("express-async-handler");
const paymentLog = require("../models/paymentLog");
const Department = require("../models/department");

const getDepartment = asyncHandler(async (req, res) => {
  const department = await Department.find();
  res.status(200).json({ department: department });
});
const createDepartment = asyncHandler(async (req, res) => {
  const department = new Department({
    name: req.body.name,
    budgetCap: req.body.budgetCap,
  });
  department.save();
  res.status(200).json({ department: department });
});

module.exports = { getDepartment, createDepartment };
