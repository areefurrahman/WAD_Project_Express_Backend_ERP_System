const logService = require("./log.service");

exports.createLog = async (req, res) => {
  try {
    const log = await logService.createLog(req.body);

    res.status(201).json({
      message: "Log created successfully",
      log
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLogs = async (req, res) => {
  try {
    const { user, module, startDate, endDate } = req.query;
    const logs = await logService.getAllLogs({ user, module, startDate, endDate });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLogById = async (req, res) => {
  try {
    const log = await logService.getLogById(req.params.id);
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserLogs = async (req, res) => {
  try {
    const logs = await logService.getUserLogs(req.params.userId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOldLogs = async (req, res) => {
  try {
    const { days } = req.query;
    const result = await logService.deleteOldLogs(days ? parseInt(days) : 90);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};