const service = require("./product.service");

const createProduct = async (req, res) => {
  const product = await service.createProduct(req.body);
  res.status(201).json(product);
};

const getProducts = async (req, res) => {
  const products = await service.getProducts();
  res.json(products);
};

const getProduct = async (req, res) => {
  const product = await service.getProductById(req.params.id);
  res.json(product);
};

const updateProduct = async (req, res) => {
  const product = await service.updateProduct(req.params.id, req.body);
  res.json(product);
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct
};
