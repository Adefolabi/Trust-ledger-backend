const mongoose = require("mongoose");

const roleChangeRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId, // HR user id
      ref: "User",
      required: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId, // the user whose role/info is being changed
      ref: "User",
      required: true,
    },
    changeType: {
      type: String,
      enum: ["edit", "delete", "roleChange"],
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    adminApprovalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const RoleChangeRequest = mongoose.model(
  "RoleChangeRequest",
  roleChangeRequestSchema,
);

export default RoleChangeRequest;
