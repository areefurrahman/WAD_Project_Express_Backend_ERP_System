const express = require("express");
const passport = require("passport");
const saleController = require("./sale.controller");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  saleController.createSale
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  saleController.getAllSales
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  saleController.getSaleById
);

module.exports = router;

/*
===============================================
SALES MODULE - API TESTING GUIDE
===============================================

------------------------------------------
1. CREATE SALE
------------------------------------------
Method: POST
Endpoint: /api/sales
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Create new sale transaction

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample Request Body:
{
  "customer": "507f1f77bcf86cd799439020",
  "items": [
    {
      "product": "507f1f77bcf86cd799439013",
      "quantity": 2
    },
    {
      "product": "507f1f77bcf86cd799439014",
      "quantity": 1
    }
  ]
}

Sample Response (Success - 201):
{
  "message": "Sale created successfully",
  "sale": {
    "_id": "507f1f77bcf86cd799439030",
    "customer": "507f1f77bcf86cd799439020",
    "items": [
      {
        "product": "507f1f77bcf86cd799439013",
        "quantity": 2,
        "priceAtSale": 95000,
        "subtotal": 190000
      },
      {
        "product": "507f1f77bcf86cd799439014",
        "quantity": 1,
        "priceAtSale": 380000,
        "subtotal": 380000
      }
    ],
    "totalAmount": 570000,
    "createdBy": "507f1f77bcf86cd799439011",
    "status": "completed",
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
}

How to Test in Postman:
1. First create customer using /api/customers
2. Create products using /api/products
3. Note down customer ID and product IDs
4. Login as STAFF/ADMIN to get token
5. Select POST method
6. URL: http://localhost:3000/api/sales
7. Add Authorization header with Bearer token
8. Go to Body > raw > JSON
9. Paste the sample request body (replace IDs)
10. Click Send
11. Stock will auto-decrease after sale

------------------------------------------
2. GET ALL SALES
------------------------------------------
Method: GET
Endpoint: /api/sales
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get list of all sales

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample Response (Success - 200):
[
  {
    "_id": "507f1f77bcf86cd799439030",
    "customer": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Ali Raza",
      "phone": "03001234567"
    },
    "items": [
      {
        "product": {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Samsung Galaxy A54"
        },
        "quantity": 2,
        "priceAtSale": 95000,
        "subtotal": 190000
      }
    ],
    "totalAmount": 570000,
    "createdBy": {
      "name": "Fatima Khan",
      "email": "fatima.khan@erp.com"
    },
    "status": "completed",
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
]

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/sales
3. Add Authorization header with Bearer token
4. Click Send

------------------------------------------
3. GET SALE BY ID
------------------------------------------
Method: GET
Endpoint: /api/sales/:id
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get specific sale details

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample URL:
http://localhost:3000/api/sales/507f1f77bcf86cd799439030

Sample Response (Success - 200):
{
  "_id": "507f1f77bcf86cd799439030",
  "customer": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Ali Raza",
    "phone": "03001234567",
    "address": "Block A, Gulberg III, Lahore"
  },
  "items": [
    {
      "product": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Samsung Galaxy A54",
        "sku": "SGH-A54-BLK-128"
      },
      "quantity": 2,
      "priceAtSale": 95000,
      "subtotal": 190000
    }
  ],
  "totalAmount": 570000,
  "status": "completed",
  "createdAt": "2024-01-15T14:30:00.000Z"
}

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/sales/{SALE_ID}
3. Replace {SALE_ID} with actual ID
4. Add Authorization header with Bearer token
5. Click Send

------------------------------------------
ADDITIONAL TEST DATA (Pakistani Context)
------------------------------------------

Single Item Sale:
{
  "customer": "CUSTOMER_ID_HERE",
  "items": [
    {
      "product": "PRODUCT_ID_HERE",
      "quantity": 1
    }
  ]
}

Multiple Items Sale:
{
  "customer": "CUSTOMER_ID_HERE",
  "items": [
    {
      "product": "SAMSUNG_PHONE_ID",
      "quantity": 3
    },
    {
      "product": "EARBUDS_ID",
      "quantity": 5
    },
    {
      "product": "POWERBANK_ID",
      "quantity": 2
    }
  ]
}

Bulk Electronics Sale:
{
  "customer": "CUSTOMER_ID_HERE",
  "items": [
    {
      "product": "LAPTOP_ID",
      "quantity": 10
    },
    {
      "product": "MOUSE_ID",
      "quantity": 10
    }
  ]
}

NOTES:
- Stock automatically decreases when sale is created
- Price is locked at time of sale (priceAtSale field)
- Customer balance is NOT updated (cash sales only for now)
- Sale total is auto-calculated from items
*/