const SystemLog = require("../../models/systemLog.model");

exports.createLog = async (logData) => {
  const { user, action, module, details, ipAddress } = logData;

  const log = await SystemLog.create({
    user,
    action,
    module,
    details,
    ipAddress,
    timestamp: new Date()
  });

  return log;
};

exports.getAllLogs = async (filters = {}) => {
  const { user, module, startDate, endDate } = filters;

  const query = {};

  if (user) {
    query.user = user;
  }

  if (module) {
    query.module = module;
  }

  if (startDate && endDate) {
    query.timestamp = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const logs = await SystemLog.find(query)
    .populate("user", "name email")
    .sort({ timestamp: -1 });

  return logs;
};

exports.getLogById = async (logId) => {
  const log = await SystemLog.findById(logId).populate("user", "name email");

  if (!log) {
    throw new Error("Log not found");
  }

  return log;
};

exports.getUserLogs = async (userId) => {
  const logs = await SystemLog.find({ user: userId })
    .populate("user", "name email")
    .sort({ timestamp: -1 });

  return logs;
};

exports.deleteOldLogs = async (days = 90) => {
  const date = new Date();
  date.setDate(date.getDate() - days);

  const result = await SystemLog.deleteMany({
    timestamp: { $lt: date }
  });

  return {
    message: `Deleted ${result.deletedCount} old logs`,
    deletedCount: result.deletedCount
  };
};