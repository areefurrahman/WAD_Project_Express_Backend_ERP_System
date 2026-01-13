const mongoose = require("mongoose");

const stockLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true
    },
    quantity: { type: Number, required: true },
    reason: { type: String },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockLog", stockLogSchema);
