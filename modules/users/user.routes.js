const express = require("express");
const passport = require("passport");
const authorizeRoles = require("../../middlewares/role.middleware");
const controller = require("./user.controller");

const router = express.Router();

router.use(
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN")
);

router.post("/", controller.createUser);
router.get("/", controller.getUsers);
router.get("/:id", controller.getUser);
router.put("/:id", controller.updateUser);
router.patch("/:id/disable", controller.disableUser);

module.exports = router;

/*
===============================================
USER MANAGEMENT MODULE - API TESTING GUIDE
===============================================
NOTE: All APIs require ADMIN role authentication

------------------------------------------
1. CREATE USER
------------------------------------------
Method: POST
Endpoint: /api/users
Role: ADMIN only
Purpose: Create new staff or admin user

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Request Body:
{
  "name": "Sana Malik",
  "email": "sana.malik@erp.com",
  "password": "Sana@2024",
  "role": "STAFF"
}

Sample Response (Success - 201):
{
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Sana Malik",
    "email": "sana.malik@erp.com",
    "role": "STAFF",
    "isActive": true,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}

How to Test in Postman:
1. First login as ADMIN to get token
2. Select POST method
3. URL: http://localhost:3000/api/users
4. Add Authorization header with Bearer token
5. Go to Body > raw > JSON
6. Paste the sample request body
7. Click Send

------------------------------------------
2. GET ALL USERS
------------------------------------------
Method: GET
Endpoint: /api/users
Role: ADMIN only
Purpose: Get list of all users in system

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Response (Success - 200):
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Usman Ahmed",
    "email": "usman.ahmed@erp.com",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-10T09:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Sana Malik",
    "email": "sana.malik@erp.com",
    "role": "STAFF",
    "isActive": true,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
]

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/users
3. Add Authorization header with Bearer token
4. Click Send

------------------------------------------
3. GET USER BY ID
------------------------------------------
Method: GET
Endpoint: /api/users/:id
Role: ADMIN only
Purpose: Get specific user details by ID

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample URL:
http://localhost:3000/api/users/507f1f77bcf86cd799439012

Sample Response (Success - 200):
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Sana Malik",
  "email": "sana.malik@erp.com",
  "role": "STAFF",
  "isActive": true,
  "createdAt": "2024-01-15T11:00:00.000Z"
}

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/users/{USER_ID}
3. Replace {USER_ID} with actual ID
4. Add Authorization header with Bearer token
5. Click Send

------------------------------------------
4. UPDATE USER
------------------------------------------
Method: PUT
Endpoint: /api/users/:id
Role: ADMIN only
Purpose: Update user information

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Request Body:
{
  "name": "Sana Malik Khan",
  "email": "sana.malik.khan@erp.com",
  "role": "MANAGER"
}

Sample Response (Success - 200):
{
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Sana Malik Khan",
    "email": "sana.malik.khan@erp.com",
    "role": "MANAGER",
    "isActive": true
  }
}

How to Test in Postman:
1. Select PUT method
2. URL: http://localhost:3000/api/users/{USER_ID}
3. Add Authorization header with Bearer token
4. Go to Body > raw > JSON
5. Paste the sample request body
6. Click Send

------------------------------------------
5. DISABLE USER
------------------------------------------
Method: PATCH
Endpoint: /api/users/:id/disable
Role: ADMIN only
Purpose: Disable user account (soft delete)

Headers Required:
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN

Sample Response (Success - 200):
{
  "message": "User disabled successfully"
}

How to Test in Postman:
1. Select PATCH method
2. URL: http://localhost:3000/api/users/{USER_ID}/disable
3. Add Authorization header with Bearer token
4. Click Send

------------------------------------------
ADDITIONAL TEST DATA (Pakistani Context)
------------------------------------------

Create Sales Staff:
{
  "name": "Bilal Hussain",
  "email": "bilal.hussain@erp.com",
  "password": "Bilal@123",
  "role": "STAFF"
}

Create Manager:
{
  "name": "Ayesha Riaz",
  "email": "ayesha.riaz@erp.com",
  "password": "Ayesha@123",
  "role": "MANAGER"
}

Create Another Admin:
{
  "name": "Hassan Raza",
  "email": "hassan.raza@erp.com",
  "password": "Hassan@Admin",
  "role": "ADMIN"
}

Update User:
{
  "name": "Bilal Hussain Khan",
  "email": "bilal.hussain@erp.com"
}
*/