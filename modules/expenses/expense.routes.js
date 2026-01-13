const express = require("express");
const passport = require("passport");
const authorizeRoles = require("../../middlewares/role.middleware");
const expenseController = require("./expense.controller");

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", expenseController.createExpense);
router.get("/", expenseController.getAllExpenses);
router.get("/report", expenseController.getExpenseReport);
router.get("/:id", expenseController.getExpenseById);
router.put("/:id", authorizeRoles("ADMIN"), expenseController.updateExpense);
router.delete("/:id", authorizeRoles("ADMIN"), expenseController.deleteExpense);

module.exports = router;

/*
===============================================
EXPENSE MANAGEMENT MODULE - API TESTING GUIDE
===============================================

------------------------------------------
1. CREATE EXPENSE
------------------------------------------
Method: POST
Endpoint: /api/expenses
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Record daily business expense

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample Request Body:
{
  "title": "Office Rent - January 2024",
  "category": "507f1f77bcf86cd799439050",
  "amount": 50000,
  "date": "2024-01-15",
  "note": "Monthly rent payment for main office"
}

Sample Response (Success - 201):
{
  "message": "Expense created successfully",
  "expense": {
    "_id": "507f1f77bcf86cd799439060",
    "title": "Office Rent - January 2024",
    "category": "507f1f77bcf86cd799439050",
    "amount": 50000,
    "date": "2024-01-15T00:00:00.000Z",
    "note": "Monthly rent payment for main office",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T15:00:00.000Z"
  }
}

How to Test in Postman:
1. First create expense category using /api/expense-categories
2. Note down category ID
3. Login as STAFF/ADMIN to get token
4. Select POST method
5. URL: http://localhost:3000/api/expenses
6. Add Authorization header with Bearer token
7. Go to Body > raw > JSON
8. Paste the sample request body (replace category ID)
9. Click Send

------------------------------------------
2. GET ALL EXPENSES
------------------------------------------
Method: GET
Endpoint: /api/expenses
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get list of all expenses

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample Response (Success - 200):
[
  {
    "_id": "507f1f77bcf86cd799439060",
    "title": "Office Rent - January 2024",
    "category": {
      "_id": "507f1f77bcf86cd799439050",
      "categoryName": "Rent"
    },
    "amount": 50000,
    "date": "2024-01-15T00:00:00.000Z",
    "note": "Monthly rent payment for main office",
    "createdBy": {
      "name": "Ahmed Ali",
      "email": "ahmed.ali@example.com"
    },
    "createdAt": "2024-01-15T15:00:00.000Z"
  }
]

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/expenses
3. Add Authorization header with Bearer token
4. Click Send

------------------------------------------
3. GET EXPENSE BY ID
------------------------------------------
Method: GET
Endpoint: /api/expenses/:id
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get specific expense details

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample URL:
http://localhost:3000/api/expenses/507f1f77bcf86cd799439060

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/expenses/{EXPENSE_ID}
3. Add Authorization header with Bearer token
4. Click Send

------------------------------------------
4. GET EXPENSE REPORT
------------------------------------------
Method: GET
Endpoint: /api/expenses/report?startDate=2024-01-01&endDate=2024-01-31
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get expense summary for date range

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Query Parameters:
- startDate (optional): Start date (YYYY-MM-DD)
- endDate (optional): End date (YYYY-MM-DD)

Sample URL:
http://localhost:3000/api/expenses/report?startDate=2024-01-01&endDate=2024-01-31

Sample Response (Success - 200):
{
  "expenses": [...array of expenses...],
  "totalAmount": 125000,
  "count": 8
}

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/expenses/report
3. Add Query Params: startDate and endDate
4. Add Authorization header with Bearer token
5. Click Send

------------------------------------------
5. UPDATE EXPENSE
------------------------------------------
Method: PUT
Endpoint: /api/expenses/:id
Role: ADMIN only
Purpose: Update expense information

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Request Body:
{
  "title": "Office Rent - January 2024 (Paid)",
  "amount": 52000,
  "note": "Monthly rent payment - Increased this month"
}

How to Test in Postman:
1. Login as ADMIN to get token
2. Select PUT method
3. URL: http://localhost:3000/api/expenses/{EXPENSE_ID}
4. Add Authorization header with Bearer token
5. Go to Body > raw > JSON
6. Paste the sample request body
7. Click Send

------------------------------------------
6. DELETE EXPENSE
------------------------------------------
Method: DELETE
Endpoint: /api/expenses/:id
Role: ADMIN only
Purpose: Delete expense record

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

How to Test in Postman:
1. Login as ADMIN to get token
2. Select DELETE method
3. URL: http://localhost:3000/api/expenses/{EXPENSE_ID}
4. Add Authorization header with Bearer token
5. Click Send

------------------------------------------
ADDITIONAL TEST DATA (Pakistani Context)
------------------------------------------

Rent:
{
  "title": "Shop Rent - February 2024",
  "category": "RENT_CATEGORY_ID",
  "amount": 45000,
  "date": "2024-02-01",
  "note": "Monthly shop rent for Lahore branch"
}

Utilities:
{
  "title": "Electricity Bill - January",
  "category": "UTILITIES_CATEGORY_ID",
  "amount": 18500,
  "date": "2024-01-20",
  "note": "LESCO bill for main office"
}

{
  "title": "Gas Bill - January",
  "category": "UTILITIES_CATEGORY_ID",
  "amount": 3500,
  "date": "2024-01-22",
  "note": "SSGC monthly bill"
}

{
  "title": "Internet Bill - January",
  "category": "UTILITIES_CATEGORY_ID",
  "amount": 4500,
  "date": "2024-01-18",
  "note": "PTCL broadband connection"
}

Salaries:
{
  "title": "Staff Salaries - January 2024",
  "category": "SALARY_CATEGORY_ID",
  "amount": 250000,
  "date": "2024-01-31",
  "note": "Monthly salaries for 5 employees"
}

Transportation:
{
  "title": "Petrol Expense",
  "category": "TRANSPORT_CATEGORY_ID",
  "amount": 12000,
  "date": "2024-01-15",
  "note": "Delivery van fuel cost"
}

{
  "title": "Rider Payments",
  "category": "TRANSPORT_CATEGORY_ID",
  "amount": 8500,
  "date": "2024-01-16",
  "note": "Weekly payment to delivery riders"
}

Maintenance:
{
  "title": "AC Repair Service",
  "category": "MAINTENANCE_CATEGORY_ID",
  "amount": 6500,
  "date": "2024-01-10",
  "note": "Annual maintenance of office ACs"
}

Marketing:
{
  "title": "Facebook Ads Campaign",
  "category": "MARKETING_CATEGORY_ID",
  "amount": 15000,
  "date": "2024-01-12",
  "note": "Monthly social media marketing budget"
}

Office Supplies:
{
  "title": "Stationery Purchase",
  "category": "SUPPLIES_CATEGORY_ID",
  "amount": 4200,
  "date": "2024-01-08",
  "note": "Papers, pens, files, and folders"
}
*/