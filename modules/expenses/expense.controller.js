const expenseService = require("./expense.service");

exports.createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body, req.user._id);

    res.status(201).json({
      message: "Expense created successfully",
      expense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.body);

    res.json({
      message: "Expense updated successfully",
      expense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await expenseService.getExpenseReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};