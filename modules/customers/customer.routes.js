const express = require("express");
const passport = require("passport");
const authorizeRoles = require("../../middlewares/role.middleware");
const controller = require("./customer.controller");

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", controller.createCustomer);
router.get("/", controller.getCustomers);
router.get("/:id", controller.getCustomer);
router.put("/:id", authorizeRoles("ADMIN"), controller.updateCustomer);

module.exports = router;

/*
===============================================
CUSTOMER MANAGEMENT MODULE - API TESTING GUIDE
===============================================

------------------------------------------
1. CREATE CUSTOMER
------------------------------------------
Method: POST
Endpoint: /api/customers
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Add new customer to database

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample Request Body:
{
  "name": "Muhammad Ali Raza",
  "phone": "03001234567",
  "address": "House 42, Street 5, Block A, Gulberg III, Lahore",
  "balance": 0
}

Sample Response (Success - 201):
{
  "message": "Customer created successfully",
  "customer": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Muhammad Ali Raza",
    "phone": "03001234567",
    "address": "House 42, Street 5, Block A, Gulberg III, Lahore",
    "balance": 0,
    "createdAt": "2024-01-15T13:00:00.000Z"
  }
}

How to Test in Postman:
1. Login as STAFF/ADMIN to get token
2. Select POST method
3. URL: http://localhost:3000/api/customers
4. Add Authorization header with Bearer token
5. Go to Body > raw > JSON
6. Paste the sample request body
7. Click Send

------------------------------------------
2. GET ALL CUSTOMERS
------------------------------------------
Method: GET
Endpoint: /api/customers
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get list of all customers

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample Response (Success - 200):
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Muhammad Ali Raza",
    "phone": "03001234567",
    "address": "House 42, Street 5, Block A, Gulberg III, Lahore",
    "balance": 0,
    "createdAt": "2024-01-15T13:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439021",
    "name": "Ayesha Tariq",
    "phone": "03219876543",
    "address": "Flat 12, Al-Rehman Plaza, DHA Phase 5, Karachi",
    "balance": 25000,
    "createdAt": "2024-01-15T13:15:00.000Z"
  }
]

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/customers
3. Add Authorization header with Bearer token
4. Click Send

------------------------------------------
3. GET CUSTOMER BY ID
------------------------------------------
Method: GET
Endpoint: /api/customers/:id
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get specific customer details

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample URL:
http://localhost:3000/api/customers/507f1f77bcf86cd799439020

Sample Response (Success - 200):
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Muhammad Ali Raza",
  "phone": "03001234567",
  "address": "House 42, Street 5, Block A, Gulberg III, Lahore",
  "balance": 0,
  "createdAt": "2024-01-15T13:00:00.000Z"
}

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/customers/{CUSTOMER_ID}
3. Replace {CUSTOMER_ID} with actual ID
4. Add Authorization header with Bearer token
5. Click Send

------------------------------------------
4. UPDATE CUSTOMER
------------------------------------------
Method: PUT
Endpoint: /api/customers/:id
Role: ADMIN only
Purpose: Update customer information

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Request Body:
{
  "name": "Muhammad Ali Raza Khan",
  "phone": "03001234567",
  "address": "House 42, Street 5, Block A, Gulberg III, Lahore, Punjab",
  "balance": 5000
}

Sample Response (Success - 200):
{
  "message": "Customer updated successfully",
  "customer": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Muhammad Ali Raza Khan",
    "phone": "03001234567",
    "address": "House 42, Street 5, Block A, Gulberg III, Lahore, Punjab",
    "balance": 5000
  }
}

How to Test in Postman:
1. Login as ADMIN to get token
2. Select PUT method
3. URL: http://localhost:3000/api/customers/{CUSTOMER_ID}
4. Add Authorization header with Bearer token
5. Go to Body > raw > JSON
6. Paste the sample request body
7. Click Send

------------------------------------------
ADDITIONAL TEST DATA (Pakistani Context)
------------------------------------------

Lahore Customers:
{
  "name": "Hassan Mahmood",
  "phone": "03334445566",
  "address": "Shop 15, Liberty Market, Gulberg, Lahore",
  "balance": 0
}

{
  "name": "Zainab Asif",
  "phone": "03451122334",
  "address": "House 88, Johar Town, Lahore",
  "balance": 15000
}

Karachi Customers:
{
  "name": "Imran Siddiqui",
  "phone": "03002223344",
  "address": "Plot 234, Clifton Block 5, Karachi",
  "balance": 0
}

{
  "name": "Sana Shahid",
  "phone": "03129998877",
  "address": "Flat 5B, Bahria Heights, Karachi",
  "balance": 50000
}

Islamabad Customers:
{
  "name": "Bilal Ahmed",
  "phone": "03335556677",
  "address": "House 45, F-10/3, Islamabad",
  "balance": 0
}

{
  "name": "Nida Hameed",
  "phone": "03456667788",
  "address": "Apartment 302, Blue Area, Islamabad",
  "balance": 30000
}

Faisalabad Customers:
{
  "name": "Umar Farooq",
  "phone": "03007778899",
  "address": "Shop 22, Cloth Market, Faisalabad",
  "balance": 10000
}

Multan Customers:
{
  "name": "Rabia Malik",
  "phone": "03218889900",
  "address": "House 67, Bosan Road, Multan",
  "balance": 0
}
*/