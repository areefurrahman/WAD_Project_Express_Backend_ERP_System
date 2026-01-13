const Sale = require("../../models/sale.model");

exports.getDailySales = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: today },
        status: "completed"
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  return result[0] || { totalSales: 0, totalOrders: 0 };
};

exports.getMonthlySales = async () => {
  const result = await Sale.aggregate([
    {
      $match: { status: "completed" }
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        totalSales: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ]);

  return result;
};

exports.getTopProducts = async () => {
  const result = await Sale.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.subtotal" }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  return result;
};

exports.getCustomerSales = async () => {
  const result = await Sale.aggregate([
    {
      $group: {
        _id: "$customer",
        totalSpent: { $sum: "$totalAmount" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { totalSpent: -1 } }
  ]);

  return result;
};