// middlewares/validateObjectId.js
const mongoose = require("mongoose");

const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid object id" });
    }
    next();
  };
};

module.exports = validateObjectId;
