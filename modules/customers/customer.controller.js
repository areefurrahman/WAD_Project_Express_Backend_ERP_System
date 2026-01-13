const service = require("./customer.service");

const createCustomer = async (req, res) => {
  const customer = await service.createCustomer(req.body);
  res.status(201).json(customer);
};

const getCustomers = async (req, res) => {
  const customers = await service.getCustomers();
  res.json(customers);
};

const getCustomer = async (req, res) => {
  const customer = await service.getCustomerById(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json(customer);
};

const updateCustomer = async (req, res) => {
  const customer = await service.updateCustomer(req.params.id, req.body);
  res.json(customer);
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer
};
