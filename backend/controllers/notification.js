const asyncHandler = require("express-async-handler");
const Notification = require("../models/notification");

const getNotification = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ notifications });
});

const createNotification = asyncHandler(async (req, res) => {
  const notification = await new Notification({
    userId: req.user.id,
    type: req.body.type,
    message: req.body.message,
    data: req.body.data,
  }).save();
  res.status(201).json({ notification });
});

const readNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true },
  );
  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }
  res.status(200).json({ notification });
});

module.exports = {
  readNotification,
  createNotification,
  getNotification,
};
