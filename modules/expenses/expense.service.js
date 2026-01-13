const Expense = require("../../models/expense.model");
const ExpenseCategory = require("../../models/expenseCategory.model");

exports.createExpense = async (expenseData, userId) => {
  const { title, category, amount, date, note } = expenseData;

  const categoryExists = await ExpenseCategory.findById(category);
  if (!categoryExists) {
    throw new Error("Expense category not found");
  }

  const expense = await Expense.create({
    title,
    category,
    amount,
    date,
    note,
    createdBy: userId
  });

  return expense;
};

exports.getAllExpenses = async () => {
  const expenses = await Expense.find()
    .populate("category", "categoryName")
    .populate("createdBy", "name email")
    .sort({ date: -1 });

  return expenses;
};

exports.getExpenseById = async (expenseId) => {
  const expense = await Expense.findById(expenseId)
    .populate("category", "categoryName")
    .populate("createdBy", "name email");

  if (!expense) {
    throw new Error("Expense not found");
  }

  return expense;
};

exports.updateExpense = async (expenseId, updateData) => {
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (updateData.category) {
    const categoryExists = await ExpenseCategory.findById(updateData.category);
    if (!categoryExists) {
      throw new Error("Expense category not found");
    }
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    expenseId,
    updateData,
    { new: true }
  )
    .populate("category", "categoryName")
    .populate("createdBy", "name email");

  return updatedExpense;
};

exports.deleteExpense = async (expenseId) => {
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  await Expense.findByIdAndDelete(expenseId);

  return { message: "Expense deleted successfully" };
};

exports.getExpenseReport = async (startDate, endDate) => {
  const query = {};

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const expenses = await Expense.find(query)
    .populate("category", "categoryName")
    .sort({ date: -1 });

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return {
    expenses,
    totalAmount,
    count: expenses.length
  };
};