const Return = require("../../models/return.model");
const Sale = require("../../models/sale.model");
const Product = require("../../models/product.model");

exports.createReturn = async (returnData, userId) => {
  const { sale, product, quantity, refundAmount, reason } = returnData;

  const saleExists = await Sale.findById(sale);
  if (!saleExists) {
    throw new Error("Sale not found");
  }

  const productExists = await Product.findById(product);
  if (!productExists) {
    throw new Error("Product not found");
  }

  const saleItem = saleExists.items.find(
    (item) => item.product.toString() === product
  );

  if (!saleItem) {
    throw new Error("Product not found in this sale");
  }

  if (quantity > saleItem.quantity) {
    throw new Error("Return quantity cannot exceed sale quantity");
  }

  const returnRecord = await Return.create({
    sale,
    product,
    quantity,
    refundAmount,
    reason,
    createdBy: userId
  });

  productExists.quantity += quantity;
  await productExists.save();

  return returnRecord;
};

exports.getAllReturns = async () => {
  const returns = await Return.find()
    .populate("sale")
    .populate("product")
    .populate("createdBy", "name email")
    .sort({ date: -1 });

  return returns;
};

exports.getReturnById = async (returnId) => {
  const returnRecord = await Return.findById(returnId)
    .populate("sale")
    .populate("product")
    .populate("createdBy", "name email");

  if (!returnRecord) {
    throw new Error("Return not found");
  }

  return returnRecord;
};

exports.getReturnsBySale = async (saleId) => {
  const returns = await Return.find({ sale: saleId })
    .populate("product")
    .populate("createdBy", "name email")
    .sort({ date: -1 });

  return returns;
};

exports.deleteReturn = async (returnId) => {
  const returnRecord = await Return.findById(returnId);

  if (!returnRecord) {
    throw new Error("Return not found");
  }

  const product = await Product.findById(returnRecord.product);
  if (product) {
    product.quantity -= returnRecord.quantity;
    await product.save();
  }

  await Return.findByIdAndDelete(returnId);

  return { message: "Return deleted successfully" };
};