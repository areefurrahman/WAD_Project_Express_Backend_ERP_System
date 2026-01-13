const reportService = require("./report.service");

exports.dailySales = async (req, res) => {
  try {
    const result = await reportService.getDailySales();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.monthlySales = async (req, res) => {
  try {
    const result = await reportService.getMonthlySales();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.topProducts = async (req, res) => {
  try {
    const result = await reportService.getTopProducts();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.customerSales = async (req, res) => {
  try {
    const result = await reportService.getCustomerSales();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};