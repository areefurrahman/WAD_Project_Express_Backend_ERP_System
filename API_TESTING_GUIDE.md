# Web Based ERP Management System - API Testing Guide

## Project Status: COMPLETE ✓

All 11 modules are fully implemented with routes, controllers, services, and models.

---

## Quick Start Testing Guide

### Step 1: Start the Server
```bash
npm start
# Server should run on http://localhost:3000
```

### Step 2: Register Admin User
```
POST http://localhost:3000/api/auth/register

Body:
{
  "name": "Ahmed Ali",
  "email": "ahmed@erp.com",
  "password": "Admin@123",
  "role": "ADMIN"
}
```

### Step 3: Login and Get Token
```
POST http://localhost:3000/api/auth/login

Body:
{
  "email": "ahmed@erp.com",
  "password": "Admin@123"
}

Copy the token from response!
```

### Step 4: Use Token for All Other APIs
Add this header to all requests:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## All Modules & Their APIs

### 1. AUTHENTICATION MODULE
**Path:** `/api/auth`
**Sample Data Location:** [modules/auth/auth.routes.js](modules/auth/auth.routes.js) (Line 23+)

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/auth/register | POST | Public | Register new user |
| /api/auth/login | POST | Public | Login and get JWT token |
| /api/auth/me | GET | ALL | Get logged-in user info |

---

### 2. USER MANAGEMENT MODULE
**Path:** `/api/users`
**Sample Data Location:** [modules/users/user.routes.js](modules/users/user.routes.js) (Line 21+)

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/users | POST | ADMIN | Create new user |
| /api/users | GET | ADMIN | Get all users |
| /api/users/:id | GET | ADMIN | Get user by ID |
| /api/users/:id | PUT | ADMIN | Update user |
| /api/users/:id/disable | PATCH | ADMIN | Disable user |

---

### 3. PRODUCT MANAGEMENT MODULE
**Path:** `/api/products`
**Sample Data Location:** [modules/products/product.routes.js](modules/products/product.routes.js) (Line 17+)

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/products | POST | ADMIN | Create product |
| /api/products | GET | ALL | Get all products |
| /api/products/:id | GET | ALL | Get product by ID |
| /api/products/:id | PUT | ADMIN | Update product |

**Sample Products:** Samsung phones (Rs 85,000), HP Laptops (Rs 120,000), JBL Earbuds (Rs 8,500)

---

### 4. CUSTOMER MANAGEMENT MODULE
**Path:** `/api/customers`
**Sample Data Location:** [modules/customers/customer.routes.js](modules/customers/customer.routes.js) (Line 17+)

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/customers | POST | ALL | Create customer |
| /api/customers | GET | ALL | Get all customers |
| /api/customers/:id | GET | ALL | Get customer by ID |
| /api/customers/:id | PUT | ADMIN | Update customer |

**Sample Customers:** Ali Raza (Lahore), Ayesha Tariq (Karachi), Bilal Ahmed (Islamabad)

---

### 5. SALES MODULE
**Path:** `/api/sales`
**Sample Data Location:** [modules/sales/sale.routes.js](modules/sales/sale.routes.js) (Line 27+)

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/sales | POST | ALL | Create new sale |
| /api/sales | GET | ALL | Get all sales |
| /api/sales/:id | GET | ALL | Get sale by ID |

**Features:**
- Automatic stock decrease
- Price locked at sale time
- Multiple items per sale

---

### 6. STOCK LOGS MODULE
**Path:** `/api/stock`

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/stock/logs | GET | ALL | Get stock movement history |

---

### 7. EXPENSE CATEGORIES MODULE
**Path:** `/api/expense-categories`
**Sample Data Location:** [modules/expense-categories/expenseCategory.routes.js](modules/expense-categories/expenseCategory.routes.js) (Line 18+)

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/expense-categories | POST | ADMIN | Create category |
| /api/expense-categories | GET | ALL | Get all categories |
| /api/expense-categories/:id | GET | ALL | Get category by ID |
| /api/expense-categories/:id | PUT | ADMIN | Update category |
| /api/expense-categories/:id | DELETE | ADMIN | Delete category |

**Sample Categories:** Rent, Utilities, Salaries, Transportation, Marketing

---

### 8. EXPENSES MODULE
**Path:** `/api/expenses`
**Sample Data Location:** [modules/expenses/expense.routes.js](modules/expenses/expense.routes.js) (Line 19+)

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/expenses | POST | ALL | Create expense |
| /api/expenses | GET | ALL | Get all expenses |
| /api/expenses/:id | GET | ALL | Get expense by ID |
| /api/expenses/report | GET | ALL | Get expense report (date filter) |
| /api/expenses/:id | PUT | ADMIN | Update expense |
| /api/expenses/:id | DELETE | ADMIN | Delete expense |

**Sample Expenses:** Office Rent (Rs 50,000), Electricity Bill (Rs 18,500), Salaries (Rs 250,000)

---

### 9. RETURNS MODULE
**Path:** `/api/returns`

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/returns | POST | ALL | Create sale return |
| /api/returns | GET | ALL | Get all returns |
| /api/returns/:id | GET | ALL | Get return by ID |
| /api/returns/sale/:saleId | GET | ALL | Get returns by sale |
| /api/returns/:id | DELETE | ADMIN | Delete return |

**Features:**
- Automatic stock restoration
- Refund amount tracking

---

### 10. REPORTS MODULE
**Path:** `/api/reports`

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/reports/sales/daily | GET | ALL | Daily sales report |
| /api/reports/sales/monthly | GET | ALL | Monthly sales report |
| /api/reports/top-products | GET | ALL | Top 5 selling products |
| /api/reports/customer-sales | GET | ALL | Customer sales summary |

---

### 11. SYSTEM LOGS MODULE
**Path:** `/api/logs`

| Endpoint | Method | Role | Purpose |
|----------|--------|------|---------|
| /api/logs | POST | ADMIN | Create log entry |
| /api/logs | GET | ADMIN | Get all logs |
| /api/logs/:id | GET | ADMIN | Get log by ID |
| /api/logs/user/:userId | GET | ADMIN | Get user logs |
| /api/logs/cleanup | DELETE | ADMIN | Delete old logs |

---

## Testing Flow (Recommended Order)

### Phase 1: Setup (15 minutes)
1. Register ADMIN user
2. Login and get JWT token
3. Create 2-3 STAFF users
4. Save admin token for testing

### Phase 2: Master Data (20 minutes)
1. Create 5-6 products (use sample data from product.routes.js)
2. Create 4-5 customers (use sample data from customer.routes.js)
3. Create expense categories (Rent, Utilities, Salaries, etc.)

### Phase 3: Transactions (20 minutes)
1. Create 3-4 sales (test stock decrease)
2. Create 2-3 expenses
3. Create 1 sale return (test stock increase)

### Phase 4: Reports (10 minutes)
1. Test daily sales report
2. Test monthly sales report
3. Test top products report
4. Test expense report with date filters

### Phase 5: Admin Features (10 minutes)
1. Update a product
2. Update a customer
3. Delete an expense
4. View system logs

---

## Important Notes

### Role-Based Access
- **ADMIN**: Full access to all APIs
- **STAFF**: Cannot create/update/delete users, limited delete access
- **PUBLIC**: Only register and login

### Pakistani Context Data
All sample data includes:
- Pakistani names (Ahmed, Fatima, Ali, Ayesha, etc.)
- Pakistani phone numbers (0300-XXXXXXX format)
- Pakistani cities (Lahore, Karachi, Islamabad, Faisalabad, Multan)
- Prices in PKR (Pakistani Rupees)
- Real Pakistani products and services

### Logic Features Implemented
1. **Auto Stock Management**: Stock decreases on sale, increases on return
2. **Price Locking**: Sale price locked at time of transaction
3. **Cascading Deletes**: Category cannot be deleted if it has expenses
4. **Data Validation**: All required fields validated
5. **Error Handling**: Global error handler implemented
6. **Authentication**: JWT-based secure authentication
7. **Authorization**: Role-based access control

---

## All Files Have Sample Data

Check the bottom of each route file for:
- Sample JSON requests
- Expected responses
- Pakistani context data
- Step-by-step Postman testing instructions

**Files with complete documentation:**
1. modules/auth/auth.routes.js
2. modules/users/user.routes.js
3. modules/products/product.routes.js
4. modules/customers/customer.routes.js
5. modules/sales/sale.routes.js
6. modules/expenses/expense.routes.js
7. modules/expense-categories/expenseCategory.routes.js

---

## Project Structure

```
WAD_Project/
├── app.js                          # Main app with all routes registered
├── server.js                       # Server entry point
├── config/
│   ├── db.js                       # MongoDB connection
│   └── jwt.js                      # JWT configuration
├── middlewares/
│   ├── auth.middleware.js          # JWT authentication
│   └── role.middleware.js          # Role-based authorization
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   ├── customer.model.js
│   ├── sale.model.js
│   ├── stockLog.model.js
│   ├── expense.model.js
│   ├── expenseCategory.model.js
│   ├── return.model.js
│   └── systemLog.model.js
├── modules/
│   ├── auth/                       # Authentication module
│   ├── users/                      # User management
│   ├── products/                   # Product & stock management
│   ├── customers/                  # Customer management
│   ├── sales/                      # Sales transactions
│   ├── stock/                      # Stock logs
│   ├── expenses/                   # Expense management
│   ├── expense-categories/         # Expense categories
│   ├── returns/                    # Sale returns
│   ├── reports/                    # Business reports
│   └── logs/                       # System activity logs
└── utils/
    └── errorHandler.js             # Global error handler
```

---

## Next Steps

1. **Start MongoDB**: Ensure MongoDB is running
2. **Install Dependencies**: `npm install`
3. **Start Server**: `npm start`
4. **Test in Postman**: Follow the testing flow above
5. **Check Sample Data**: Open route files for Pakistani sample data

---

## Support

If you encounter any issues:
1. Check console for error messages
2. Verify MongoDB is running
3. Ensure JWT token is valid
4. Check role permissions for each API

---

**Project Status:** Production Ready
**Total APIs:** 45+ endpoints across 11 modules
**Code Quality:** Simple, beginner-friendly, well-documented
**Sample Data:** Pakistani context with real examples