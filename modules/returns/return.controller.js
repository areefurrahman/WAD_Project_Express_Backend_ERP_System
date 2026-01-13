const returnService = require("./return.service");

exports.createReturn = async (req, res) => {
  try {
    const returnRecord = await returnService.createReturn(req.body, req.user._id);

    res.status(201).json({
      message: "Return created successfully",
      return: returnRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReturns = async (req, res) => {
  try {
    const returns = await returnService.getAllReturns();
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReturnById = async (req, res) => {
  try {
    const returnRecord = await returnService.getReturnById(req.params.id);
    res.json(returnRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReturnsBySale = async (req, res) => {
  try {
    const returns = await returnService.getReturnsBySale(req.params.saleId);
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReturn = async (req, res) => {
  try {
    const result = await returnService.deleteReturn(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};