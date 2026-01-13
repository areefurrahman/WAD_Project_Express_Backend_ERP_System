const mongoose = require("mongoose");

const systemLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    details: {
      type: String
    },
    ipAddress: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemLog", systemLogSchema);