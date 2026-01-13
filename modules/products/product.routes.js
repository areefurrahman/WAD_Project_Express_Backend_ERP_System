const express = require("express");
const passport = require("passport");
const authorizeRoles = require("../../middlewares/role.middleware");
const controller = require("./product.controller");

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", authorizeRoles("ADMIN"), controller.createProduct);
router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.put("/:id", authorizeRoles("ADMIN"), controller.updateProduct);

module.exports = router;

/*
===============================================
PRODUCT MANAGEMENT MODULE - API TESTING GUIDE
===============================================

------------------------------------------
1. CREATE PRODUCT
------------------------------------------
Method: POST
Endpoint: /api/products
Role: ADMIN only
Purpose: Add new product to inventory

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Request Body:
{
  "name": "Samsung Galaxy A54",
  "sku": "SGH-A54-BLK-128",
  "purchasePrice": 85000,
  "salePrice": 95000,
  "quantity": 50,
  "lowStockAlert": 10
}

Sample Response (Success - 201):
{
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Samsung Galaxy A54",
    "sku": "SGH-A54-BLK-128",
    "purchasePrice": 85000,
    "salePrice": 95000,
    "quantity": 50,
    "lowStockAlert": 10,
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}

How to Test in Postman:
1. Login as ADMIN to get token
2. Select POST method
3. URL: http://localhost:3000/api/products
4. Add Authorization header with Bearer token
5. Go to Body > raw > JSON
6. Paste the sample request body
7. Click Send

------------------------------------------
2. GET ALL PRODUCTS
------------------------------------------
Method: GET
Endpoint: /api/products
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get list of all products

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample Response (Success - 200):
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Samsung Galaxy A54",
    "sku": "SGH-A54-BLK-128",
    "purchasePrice": 85000,
    "salePrice": 95000,
    "quantity": 50,
    "lowStockAlert": 10,
    "createdAt": "2024-01-15T12:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Apple iPhone 15",
    "sku": "APL-IP15-GLD-256",
    "purchasePrice": 350000,
    "salePrice": 380000,
    "quantity": 25,
    "lowStockAlert": 5,
    "createdAt": "2024-01-15T12:30:00.000Z"
  }
]

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/products
3. Add Authorization header with Bearer token
4. Click Send

------------------------------------------
3. GET PRODUCT BY ID
------------------------------------------
Method: GET
Endpoint: /api/products/:id
Role: ADMIN, STAFF (Any authenticated user)
Purpose: Get specific product details

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample URL:
http://localhost:3000/api/products/507f1f77bcf86cd799439013

Sample Response (Success - 200):
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Samsung Galaxy A54",
  "sku": "SGH-A54-BLK-128",
  "purchasePrice": 85000,
  "salePrice": 95000,
  "quantity": 50,
  "lowStockAlert": 10,
  "createdAt": "2024-01-15T12:00:00.000Z"
}

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/products/{PRODUCT_ID}
3. Replace {PRODUCT_ID} with actual ID
4. Add Authorization header with Bearer token
5. Click Send

------------------------------------------
4. UPDATE PRODUCT
------------------------------------------
Method: PUT
Endpoint: /api/products/:id
Role: ADMIN only
Purpose: Update product information

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Request Body:
{
  "name": "Samsung Galaxy A54 5G",
  "purchasePrice": 83000,
  "salePrice": 92000,
  "quantity": 75
}

Sample Response (Success - 200):
{
  "message": "Product updated successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Samsung Galaxy A54 5G",
    "sku": "SGH-A54-BLK-128",
    "purchasePrice": 83000,
    "salePrice": 92000,
    "quantity": 75,
    "lowStockAlert": 10
  }
}

How to Test in Postman:
1. Select PUT method
2. URL: http://localhost:3000/api/products/{PRODUCT_ID}
3. Add Authorization header with Bearer token
4. Go to Body > raw > JSON
5. Paste the sample request body
6. Click Send

------------------------------------------
ADDITIONAL TEST DATA (Pakistani Context)
------------------------------------------

Electronics:
{
  "name": "HP Pavilion Laptop i5 11th Gen",
  "sku": "HP-PAV-I5-512SSD",
  "purchasePrice": 120000,
  "salePrice": 135000,
  "quantity": 15,
  "lowStockAlert": 3
}

{
  "name": "Dell XPS 13 Laptop",
  "sku": "DELL-XPS13-I7-1TB",
  "purchasePrice": 280000,
  "salePrice": 310000,
  "quantity": 8,
  "lowStockAlert": 2
}

Mobile Phones:
{
  "name": "Infinix Note 30 Pro",
  "sku": "INF-N30P-BLU-256",
  "purchasePrice": 55000,
  "salePrice": 62000,
  "quantity": 100,
  "lowStockAlert": 20
}

{
  "name": "Xiaomi Redmi Note 13",
  "sku": "XIA-RN13-GRN-128",
  "purchasePrice": 48000,
  "salePrice": 54000,
  "quantity": 80,
  "lowStockAlert": 15
}

Accessories:
{
  "name": "JBL Wireless Earbuds",
  "sku": "JBL-TWS-BLK",
  "purchasePrice": 8500,
  "salePrice": 11000,
  "quantity": 200,
  "lowStockAlert": 50
}

{
  "name": "Anker PowerBank 20000mAh",
  "sku": "ANK-PB-20K",
  "purchasePrice": 6500,
  "salePrice": 8500,
  "quantity": 150,
  "lowStockAlert": 30
}

Home Appliances:
{
  "name": "Dawlance Refrigerator 14 CFT",
  "sku": "DWL-REF-14-WHT",
  "purchasePrice": 65000,
  "salePrice": 75000,
  "quantity": 12,
  "lowStockAlert": 3
}

{
  "name": "Orient Air Conditioner 1.5 Ton",
  "sku": "ORT-AC-1.5T-WHT",
  "purchasePrice": 85000,
  "salePrice": 98000,
  "quantity": 20,
  "lowStockAlert": 5
}
*/