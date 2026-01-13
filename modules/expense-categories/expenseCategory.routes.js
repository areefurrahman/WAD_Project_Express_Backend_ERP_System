const express = require("express");
const passport = require("passport");
const authorizeRoles = require("../../middlewares/role.middleware");
const categoryController = require("./expenseCategory.controller");

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", authorizeRoles("ADMIN"), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", authorizeRoles("ADMIN"), categoryController.updateCategory);
router.delete("/:id", authorizeRoles("ADMIN"), categoryController.deleteCategory);

module.exports = router;

/*
===============================================
EXPENSE CATEGORY MODULE - API TESTING GUIDE
===============================================

------------------------------------------
1. CREATE EXPENSE CATEGORY
------------------------------------------
Method: POST
Endpoint: /api/expense-categories
Role: ADMIN only
Purpose: Create new expense category

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Request Body:
{
  "categoryName": "Rent",
  "description": "Monthly office and shop rent payments"
}

Sample Response (Success - 201):
{
  "message": "Category created successfully",
  "category": {
    "_id": "507f1f77bcf86cd799439050",
    "categoryName": "Rent",
    "description": "Monthly office and shop rent payments",
    "createdAt": "2024-01-15T14:00:00.000Z"
  }
}

How to Test in Postman:
1. Login as ADMIN to get token
2. Select POST method
3. URL: http://localhost:3000/api/expense-categories
4. Add Authorization header with Bearer token
5. Go to Body > raw > JSON
6. Paste the sample request body
7. Click Send

------------------------------------------
2. GET ALL CATEGORIES
------------------------------------------
Method: GET
Endpoint: /api/expense-categories
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get list of all expense categories

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample Response (Success - 200):
[
  {
    "_id": "507f1f77bcf86cd799439050",
    "categoryName": "Rent",
    "description": "Monthly office and shop rent payments",
    "createdAt": "2024-01-15T14:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439051",
    "categoryName": "Utilities",
    "description": "Electricity, gas, water, internet bills",
    "createdAt": "2024-01-15T14:05:00.000Z"
  }
]

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/expense-categories
3. Add Authorization header with Bearer token
4. Click Send

------------------------------------------
3. GET CATEGORY BY ID
------------------------------------------
Method: GET
Endpoint: /api/expense-categories/:id
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get specific category details

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample URL:
http://localhost:3000/api/expense-categories/507f1f77bcf86cd799439050

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/expense-categories/{CATEGORY_ID}
3. Add Authorization header with Bearer token
4. Click Send

------------------------------------------
4. UPDATE CATEGORY
------------------------------------------
Method: PUT
Endpoint: /api/expense-categories/:id
Role: ADMIN only
Purpose: Update category information

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Request Body:
{
  "categoryName": "Office Rent",
  "description": "Monthly office and shop rent payments - Updated"
}

How to Test in Postman:
1. Login as ADMIN to get token
2. Select PUT method
3. URL: http://localhost:3000/api/expense-categories/{CATEGORY_ID}
4. Add Authorization header with Bearer token
5. Go to Body > raw > JSON
6. Paste the sample request body
7. Click Send

------------------------------------------
5. DELETE CATEGORY
------------------------------------------
Method: DELETE
Endpoint: /api/expense-categories/:id
Role: ADMIN only
Purpose: Delete expense category (only if no expenses exist)

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Response (Success - 200):
{
  "message": "Category deleted successfully"
}

NOTE: Category cannot be deleted if it has associated expenses

How to Test in Postman:
1. Login as ADMIN to get token
2. Select DELETE method
3. URL: http://localhost:3000/api/expense-categories/{CATEGORY_ID}
4. Add Authorization header with Bearer token
5. Click Send

------------------------------------------
ADDITIONAL TEST DATA (Pakistani Context)
------------------------------------------

Create these categories first (use them for expenses):

{
  "categoryName": "Utilities",
  "description": "Electricity, gas, water, and internet bills"
}

{
  "categoryName": "Salaries",
  "description": "Monthly employee salary payments"
}

{
  "categoryName": "Transportation",
  "description": "Fuel, delivery charges, and vehicle maintenance"
}

{
  "categoryName": "Maintenance",
  "description": "Office and equipment maintenance costs"
}

{
  "categoryName": "Marketing",
  "description": "Advertisement and promotional expenses"
}

{
  "categoryName": "Office Supplies",
  "description": "Stationery and office consumables"
}

{
  "categoryName": "Communication",
  "description": "Phone and internet charges"
}

{
  "categoryName": "Legal & Professional",
  "description": "Lawyer fees, accounting services, licenses"
}

{
  "categoryName": "Insurance",
  "description": "Business and health insurance premiums"
}

{
  "categoryName": "Miscellaneous",
  "description": "Other business-related expenses"
}

IMPORTANT NOTES:
- Create expense categories FIRST before creating expenses
- Category names must be unique
- Cannot delete category that has expenses
- All authenticated users can view categories
- Only ADMIN can create, update, or delete categories
*/