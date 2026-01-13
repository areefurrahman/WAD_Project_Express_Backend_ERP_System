const ExpenseCategory = require("../../models/expenseCategory.model");
const Expense = require("../../models/expense.model");

exports.createCategory = async (categoryData) => {
  const { categoryName, description } = categoryData;

  const existingCategory = await ExpenseCategory.findOne({ categoryName });
  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await ExpenseCategory.create({
    categoryName,
    description
  });

  return category;
};

exports.getAllCategories = async () => {
  const categories = await ExpenseCategory.find().sort({ categoryName: 1 });
  return categories;
};

exports.getCategoryById = async (categoryId) => {
  const category = await ExpenseCategory.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

exports.updateCategory = async (categoryId, updateData) => {
  const category = await ExpenseCategory.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  if (updateData.categoryName) {
    const existingCategory = await ExpenseCategory.findOne({
      categoryName: updateData.categoryName,
      _id: { $ne: categoryId }
    });

    if (existingCategory) {
      throw new Error("Category name already exists");
    }
  }

  const updatedCategory = await ExpenseCategory.findByIdAndUpdate(
    categoryId,
    updateData,
    { new: true }
  );

  return updatedCategory;
};

exports.deleteCategory = async (categoryId) => {
  const category = await ExpenseCategory.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const expensesUsingCategory = await Expense.findOne({ category: categoryId });
  if (expensesUsingCategory) {
    throw new Error("Cannot delete category that has expenses");
  }

  await ExpenseCategory.findByIdAndDelete(categoryId);

  return { message: "Category deleted successfully" };
};