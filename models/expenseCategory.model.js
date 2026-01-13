const mongoose = require("mongoose");

const expenseCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExpenseCategory", expenseCategorySchema);