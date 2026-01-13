const Product = require("../../models/product.model");
const StockLog = require("../../models/stockLog.model");

const adjustStock = async ({ productId, quantity, type, reason, userId }) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  if (type === "OUT" && product.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  product.quantity =
    type === "IN"
      ? product.quantity + quantity
      : product.quantity - quantity;

  await product.save();

  await StockLog.create({
    product: productId,
    type,
    quantity,
    reason,
    performedBy: userId
  });

  return product;
};

const getStockLogs = async () => {
  return StockLog.find()
    .populate("product", "name")
    .populate("performedBy", "name");
};

module.exports = { adjustStock, getStockLogs };
