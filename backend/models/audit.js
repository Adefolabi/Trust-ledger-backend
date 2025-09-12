const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId, // user who performed the action
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId, // the affected document
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // flexible JSON for details
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }, // remove __v field
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
