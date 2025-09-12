const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    rawEvent: {
      type: mongoose.Schema.Types.Mixed, // can store JSON or any raw object
      required: true,
    },
    blockNumber: {
      type: Number,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
      index: true, // indexing useful for fast lookups
      unique: true, // if each txHash should only appear once
    },
    processed: {
      type: Boolean,
      default: false,
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Automatically set processedAt when processed is set true
eventSchema.pre("save", function (next) {
  if (this.isModified("processed") && this.processed && !this.processedAt) {
    this.processedAt = new Date();
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
