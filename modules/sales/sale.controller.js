const saleService = require("./sale.service");

exports.createSale = async (req, res) => {
  try {
    const sale = await saleService.createSale(req.body, req.user._id);

    res.status(201).json({
      message: "Sale created successfully",
      sale
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await saleService.getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};