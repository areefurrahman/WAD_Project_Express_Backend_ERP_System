const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true },
    purchasePrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    lowStockAlert: { type: Number, default: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
