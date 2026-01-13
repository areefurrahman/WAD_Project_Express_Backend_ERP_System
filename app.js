const express = require("express");
const passport = require("passport");
const errorHandler = require("./utils/errorHandler");

require("./modules/auth/passport.local");
require("./modules/auth/passport.jwt");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const productRoutes = require("./modules/products/product.routes");
const stockRoutes = require("./modules/stock/stock.routes");
const customerRoutes = require("./modules/customers/customer.routes");
const salesRoutes = require("./modules/sales/sale.routes");
const reportsRoutes = require("./modules/reports/report.routes");
const expenseRoutes = require("./modules/expenses/expense.routes");
const expenseCategoryRoutes = require("./modules/expense-categories/expenseCategory.routes");
const returnRoutes = require("./modules/returns/return.routes");
const logRoutes = require("./modules/logs/log.routes");

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/expense-categories", expenseCategoryRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/logs", logRoutes);

app.use(errorHandler);

module.exports = app;