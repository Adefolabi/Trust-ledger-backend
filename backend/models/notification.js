const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    targetRole: [
      {
        type: String,
        enum: ["hod", "hr", "finance", "admin"],
        required: false,
      },
    ],
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // extra info like { budgetId: "..." }
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
