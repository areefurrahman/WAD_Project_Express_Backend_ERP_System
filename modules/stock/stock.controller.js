const service = require("./stock.service");

const adjustStock = async (req, res) => {
  const product = await service.adjustStock({
    ...req.body,
    userId: req.user._id
  });
  res.json(product);
};

const getLogs = async (req, res) => {
  const logs = await service.getStockLogs();
  res.json(logs);
};

module.exports = { adjustStock, getLogs };
