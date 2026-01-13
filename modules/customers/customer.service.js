const Customer = require("../../models/customer.model");

const createCustomer = async (data) => {
  return Customer.create(data);
};

const getCustomers = async () => {
  return Customer.find();
};

const getCustomerById = async (id) => {
  return Customer.findById(id);
};

const updateCustomer = async (id, data) => {
  return Customer.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer
};
