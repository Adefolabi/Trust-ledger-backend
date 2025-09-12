const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      types: String,
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
