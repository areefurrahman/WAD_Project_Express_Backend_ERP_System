const Product = require("../../models/product.model");

const createProduct = async (data) => {
  return Product.create(data);
};

const getProducts = async () => {
  return Product.find();
};

const getProductById = async (id) => {
  return Product.findById(id);
};

const updateProduct = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct
};
