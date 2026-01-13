const Sale = require("../../models/sale.model");
const Product = require("../../models/product.model");
const Customer = require("../../models/customer.model");

exports.createSale = async (saleData, userId) => {
  const { customer, items } = saleData;

  if (!items || items.length === 0) {
    throw new Error("Sale items required");
  }

  const customerExists = await Customer.findById(customer);
  if (!customerExists) {
    throw new Error("Customer not found");
  }

  let totalAmount = 0;
  const saleItems = [];

  for (let item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.quantity < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const subtotal = product.salePrice * item.quantity;

    saleItems.push({
      product: product._id,
      quantity: item.quantity,
      priceAtSale: product.salePrice,
      subtotal
    });

    totalAmount += subtotal;

    // reduce stock
    product.quantity -= item.quantity;
    await product.save();
  }

  const sale = await Sale.create({
    customer,
    items: saleItems,
    totalAmount,
    createdBy: userId
  });

  return sale;
};

exports.getAllSales = async () => {
  const sales = await Sale.find()
    .populate("customer")
    .populate("items.product")
    .populate("createdBy", "name email");

  return sales;
};

exports.getSaleById = async (saleId) => {
  const sale = await Sale.findById(saleId)
    .populate("customer")
    .populate("items.product");

  if (!sale) {
    throw new Error("Sale not found");
  }

  return sale;
};