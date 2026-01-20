# Authorization System - Complete Explanation

## Table of Contents
1. [Overview](#overview)
2. [User Model and Roles](#user-model-and-roles)
3. [Authentication vs Authorization](#authentication-vs-authorization)
4. [Complete Flow Diagram](#complete-flow-diagram)
5. [Step-by-Step How It Works](#step-by-step-how-it-works)
6. [Code Explanation](#code-explanation)
7. [Practical Examples](#practical-examples)

---

## Overview

Your ERP system has a 2-layer security system:

**Layer 1: Authentication** - "Who are you?" (Login verification)
**Layer 2: Authorization** - "What are you allowed to do?" (Role checking)

Think of it like entering a secure building:
- **Authentication** = Showing your ID card to the security guard
- **Authorization** = The guard checks if your card allows you to enter specific floors

---

## User Model and Roles

### User Schema (user.model.js)

```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email (used for login)
  password: String,       // Hashed password (encrypted)
  role: String,           // "ADMIN" or "STAFF"
  isActive: Boolean       // Account status (true/false)
}
```

### Available Roles

| Role | Powers | Example Users |
|------|--------|---------------|
| **ADMIN** | Full access - create, read, update, delete everything | Shop Owner, Manager |
| **STAFF** | Limited access - can view and create, but limited delete | Sales Person, Cashier |

**Important:** The role is stored in the database when the user registers.

---

## Authentication vs Authorization

### Authentication (Who are you?)
- Happens during **login**
- Verifies email and password
- If correct, gives you a **JWT Token** (like a temporary pass)
- This token contains your **user ID** and **role**

### Authorization (What can you do?)
- Happens **after login** on every API request
- Checks your **token** to see who you are
- Checks your **role** to see if you're allowed
- If allowed, lets you access the API
- If not allowed, sends **403 Forbidden** error

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER TRIES TO LOGIN                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │ passport.local.js             │
         │ Checks email & password       │
         │ from database                 │
         └───────────┬───────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
    [CORRECT]             [WRONG]
          │                     │
          │                     └──> Return "Invalid credentials"
          │
          ▼
    ┌─────────────────────────┐
    │ auth.service.js         │
    │ generateToken()         │
    │ Creates JWT with:       │
    │ - User ID               │
    │ - User Role             │
    └────────┬────────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Token sent to user     │
    │ Example:               │
    │ "eyJhbGciOiJIUzI1..."  │
    └────────┬───────────────┘
             │
             │ User saves this token
             │
             ▼
┌────────────────────────────────────────────────────────────┐
│              USER TRIES TO ACCESS PROTECTED API             │
│              (e.g., GET /api/customers)                     │
│              Sends: Authorization: Bearer TOKEN             │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │ passport.jwt.js               │
         │ Step 1: Extracts token from   │
         │         Authorization header   │
         │ Step 2: Verifies token        │
         │ Step 3: Decodes user ID       │
         │ Step 4: Finds user in DB      │
         │ Step 5: Checks if isActive    │
         └───────────┬───────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
    [TOKEN VALID]        [TOKEN INVALID]
    User object               │
    attached to req           └──> Return "401 Unauthorized"
          │
          ▼
    ┌─────────────────────────┐
    │ req.user is now set     │
    │ req.user = {            │
    │   _id: "...",           │
    │   name: "Ahmed",        │
    │   email: "...",         │
    │   role: "ADMIN"         │
    │ }                       │
    └────────┬────────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ role.middleware.js     │
    │ authorizeRoles()       │
    │ Checks if user's role  │
    │ matches required role  │
    └────────┬───────────────┘
             │
  ┌──────────┴──────────┐
  │                     │
  ▼                     ▼
[ROLE MATCHES]    [ROLE DOESN'T MATCH]
  │                     │
  │                     └──> Return "403 Access Denied"
  │
  ▼
┌─────────────────────────┐
│ Request reaches the     │
│ controller function     │
│ API executes normally   │
└─────────────────────────┘
```

---

## Step-by-Step How It Works

### STEP 1: User Registration (First Time)

**File:** [auth.controller.js:6-32](modules/auth/auth.controller.js#L6-L32)

```javascript
POST /api/auth/register
Body: {
  "name": "Ahmed Ali",
  "email": "ahmed@erp.com",
  "password": "Admin@123",
  "role": "ADMIN"
}
```

**What happens:**
1. System checks if email already exists
2. Password is hashed using bcrypt (encrypted)
3. User saved to database with their role
4. Returns success message

**Key Point:** The password is NEVER stored as plain text. It's encrypted using bcrypt.

---

### STEP 2: User Login

**Files:**
- [passport.local.js](modules/auth/passport.local.js) - Validates credentials
- [auth.service.js](modules/auth/auth.service.js) - Generates token
- [auth.controller.js:37-51](modules/auth/auth.controller.js#L37-L51) - Returns token

```javascript
POST /api/auth/login
Body: {
  "email": "ahmed@erp.com",
  "password": "Admin@123"
}
```

**What happens:**
1. **passport.local.js** finds user by email
2. Compares entered password with hashed password using `bcrypt.compare()`
3. If match, calls **auth.service.js** to generate JWT token
4. Token is created with:
   ```javascript
   jwt.sign(
     { id: user._id, role: user.role },  // Payload (data inside token)
     "SECRET_KEY",                        // Secret key to sign
     { expiresIn: "1h" }                  // Expires in 1 hour
   )
   ```
5. Token sent back to user

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ahmed Ali",
    "email": "ahmed@erp.com",
    "role": "ADMIN"
  }
}
```

**Key Point:** The token contains the user's ID and role, encoded and signed. It cannot be modified without knowing the secret key.

---

### STEP 3: Accessing Protected API

**Example:** Get all customers

```
GET /api/customers
Headers: {
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
}
```

**What happens (in order):**

#### 3A. Route Level - JWT Authentication Check

**File:** [customer.routes.js:8](modules/customers/customer.routes.js#L8)

```javascript
router.use(passport.authenticate("jwt", { session: false }));
```

This line says: "Before accessing ANY route in this file, authenticate the user using JWT"

**What passport.authenticate() does:**
- Calls **passport.jwt.js**
- Extracts token from `Authorization: Bearer TOKEN` header
- Verifies token signature using secret key
- Decodes token to get user ID
- Finds user in database
- Checks if user exists and isActive is true
- Attaches user object to `req.user`

**File:** [passport.jwt.js:8-27](modules/auth/passport.jwt.js#L8-L27)

```javascript
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract from header
  secretOrKey: jwtConfig.secret                             // Secret to verify
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    // payload = { id: "507f...", role: "ADMIN" }

    const user = await User.findById(payload.id);

    if (!user || !user.isActive) {
      return done(null, false);  // Authentication failed
    }

    return done(null, user);  // Authentication successful, user attached to req
  })
);
```

**Result:**
- If token is valid: `req.user` is set with full user object
- If token is invalid/expired: Returns **401 Unauthorized**

---

#### 3B. Route Level - Role Authorization Check

**File:** [customer.routes.js:13](modules/customers/customer.routes.js#L13)

Some routes need specific roles:

```javascript
router.put("/:id", authorizeRoles("ADMIN"), controller.updateCustomer);
```

This means: "To update a customer, you must be ADMIN"

**How authorizeRoles() works:**

**File:** [role.middleware.js:1-10](middlewares/role.middleware.js#L1-L10)

```javascript
const authorizeRoles = (...roles) => {
  // roles = ["ADMIN"] or ["ADMIN", "STAFF"]

  return (req, res, next) => {
    // req.user.role = "STAFF" (from JWT authentication)

    if (!roles.includes(req.user.role)) {
      // If user's role is not in the allowed roles array
      return res.status(403).json({ message: "Access denied" });
    }

    next();  // Role matches, proceed to controller
  };
};
```

**Example Scenarios:**

**Scenario 1: ADMIN tries to update customer**
```
req.user.role = "ADMIN"
Required roles = ["ADMIN"]
"ADMIN" is in ["ADMIN"] ✓
Result: Access granted
```

**Scenario 2: STAFF tries to update customer**
```
req.user.role = "STAFF"
Required roles = ["ADMIN"]
"STAFF" is NOT in ["ADMIN"] ✗
Result: 403 Access Denied
```

---

#### 3C. Controller Level - Business Logic

If both authentication and authorization pass, request reaches the controller:

**File:** customer.controller.js

```javascript
const updateCustomer = async (req, res) => {
  // req.user is available here with full user info
  // req.user.role is verified to be "ADMIN"

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ message: "Customer updated", customer });
};
```

---

## Code Explanation

### 1. User Model ([user.model.js](models/user.model.js))

```javascript
role: {
  type: String,
  enum: ["ADMIN", "STAFF"],  // Only these values allowed
  default: "STAFF"            // Default role if not specified
}
```

**What this does:**
- `enum` ensures only "ADMIN" or "STAFF" can be stored
- If someone tries to save role as "HACKER", MongoDB rejects it
- Default role is "STAFF" for safety

---

### 2. JWT Token Generation ([auth.service.js](modules/auth/auth.service.js))

```javascript
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },  // Data stored in token
    jwtConfig.secret,                    // Secret key (from .env)
    { expiresIn: jwtConfig.expiresIn }   // Usually "1h"
  );
};
```

**Token Structure:**
```
Header.Payload.Signature

Header = { "alg": "HS256", "typ": "JWT" }
Payload = { "id": "507f...", "role": "ADMIN", "iat": 1234567890, "exp": 1234571490 }
Signature = HMACSHA256(Header + Payload, SECRET_KEY)
```

**Why it's secure:**
- If someone changes the role in the token (e.g., STAFF → ADMIN), the signature becomes invalid
- The secret key is only known to the server
- Token expires after set time (1 hour)

---

### 3. JWT Token Verification ([passport.jwt.js](modules/auth/passport.jwt.js))

```javascript
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret
};
```

**What this does:**
- `fromAuthHeaderAsBearerToken()` looks for: `Authorization: Bearer TOKEN`
- Extracts TOKEN part
- Uses SECRET to verify signature
- Decodes payload to get user ID and role

```javascript
const user = await User.findById(payload.id);
if (!user || !user.isActive) {
  return done(null, false);  // Reject
}
return done(null, user);  // Accept, attach user to req
```

**Security checks:**
1. Token signature is valid
2. Token is not expired
3. User exists in database
4. User account is active (isActive = true)

---

### 4. Role Authorization ([role.middleware.js](middlewares/role.middleware.js))

```javascript
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
```

**How it's used in routes:**

```javascript
// Only ADMIN can access
router.use(authorizeRoles("ADMIN"));

// ADMIN or STAFF can access (if you had this)
router.use(authorizeRoles("ADMIN", "STAFF"));

// Specific route needs ADMIN
router.put("/:id", authorizeRoles("ADMIN"), controller.update);
```

**The spread operator `...roles`:**
- `authorizeRoles("ADMIN")` → roles = ["ADMIN"]
- `authorizeRoles("ADMIN", "STAFF")` → roles = ["ADMIN", "STAFF"]

---

## Practical Examples

### Example 1: User Management Routes (ADMIN Only)

**File:** [user.routes.js:8-11](modules/users/user.routes.js#L8-L11)

```javascript
router.use(
  passport.authenticate("jwt", { session: false }),  // Step 1: Verify JWT
  authorizeRoles("ADMIN")                            // Step 2: Check ADMIN role
);

router.post("/", controller.createUser);   // Create user
router.get("/", controller.getUsers);      // Get all users
router.put("/:id", controller.updateUser); // Update user
```

**Explanation:**
- `router.use()` applies to ALL routes below it
- Every route first checks JWT token
- Then checks if user role is "ADMIN"
- If STAFF tries to access, they get 403 Forbidden

**Test:**
```bash
# STAFF user tries to create user
GET /api/users
Headers: { Authorization: Bearer STAFF_TOKEN }

Result: 403 Access Denied
```

---

### Example 2: Customer Routes (Mixed Permissions)

**File:** [customer.routes.js](modules/customers/customer.routes.js)

```javascript
router.use(passport.authenticate("jwt", { session: false }));

router.post("/", controller.createCustomer);                        // ALL users
router.get("/", controller.getCustomers);                           // ALL users
router.get("/:id", controller.getCustomer);                         // ALL users
router.put("/:id", authorizeRoles("ADMIN"), controller.updateCustomer);  // ADMIN only
```

**Explanation:**
- First line: ALL routes need JWT authentication
- Create, Read operations: Any logged-in user (ADMIN or STAFF)
- Update operation: Only ADMIN (additional check on specific route)

**Test Scenarios:**

**Scenario 1: STAFF creates customer**
```bash
POST /api/customers
Headers: { Authorization: Bearer STAFF_TOKEN }
Body: { "name": "Ali", "phone": "0300..." }

Step 1: JWT verified ✓ (STAFF is logged in)
Step 2: No role check on this route ✓
Result: 201 Customer Created
```

**Scenario 2: STAFF updates customer**
```bash
PUT /api/customers/507f...
Headers: { Authorization: Bearer STAFF_TOKEN }
Body: { "name": "Ali Khan" }

Step 1: JWT verified ✓ (STAFF is logged in)
Step 2: authorizeRoles("ADMIN") checks role
        STAFF is not ADMIN ✗
Result: 403 Access Denied
```

**Scenario 3: ADMIN updates customer**
```bash
PUT /api/customers/507f...
Headers: { Authorization: Bearer ADMIN_TOKEN }
Body: { "name": "Ali Khan" }

Step 1: JWT verified ✓ (ADMIN is logged in)
Step 2: authorizeRoles("ADMIN") checks role
        ADMIN matches ✓
Result: 200 Customer Updated
```

---

### Example 3: No Token Sent

```bash
GET /api/customers
Headers: { }  # No Authorization header

Step 1: passport.authenticate() runs
        No token found in header
Result: 401 Unauthorized
(Never reaches step 2)
```

---

### Example 4: Expired Token

```bash
GET /api/customers
Headers: { Authorization: Bearer EXPIRED_TOKEN }

Step 1: passport.jwt.js extracts token
        jwt.verify() checks expiration
        Token expired 2 hours ago
Result: 401 Unauthorized
```

---

### Example 5: Invalid Token (Modified)

```bash
# Hacker tries to change STAFF token to ADMIN

Original Token Payload: { id: "507f...", role: "STAFF" }
Modified Token Payload: { id: "507f...", role: "ADMIN" }

Step 1: passport.jwt.js extracts token
        jwt.verify() checks signature
        Signature doesn't match (because payload changed)
Result: 401 Unauthorized
```

---

## Common HTTP Status Codes

| Code | Name | Meaning | When It Happens |
|------|------|---------|-----------------|
| 200 | OK | Success | Request completed successfully |
| 201 | Created | Resource created | User/product/customer created |
| 400 | Bad Request | Invalid input | Missing fields, wrong format |
| 401 | Unauthorized | Not logged in | No token, invalid token, expired token |
| 403 | Forbidden | Logged in but not allowed | STAFF trying to access ADMIN route |
| 404 | Not Found | Resource doesn't exist | Wrong ID, route doesn't exist |
| 500 | Server Error | Something broke | Database error, code bug |

---

## Security Best Practices in This System

### 1. Password Hashing
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```
- Passwords never stored as plain text
- Uses bcrypt with salt rounds = 10
- Even database admin can't see real passwords

### 2. JWT Secret Key
```javascript
secretOrKey: process.env.JWT_SECRET
```
- Secret key stored in .env file (not in code)
- Never committed to git
- Different secret for production

### 3. Token Expiration
```javascript
expiresIn: "1h"
```
- Tokens expire after 1 hour
- User must login again
- Limits damage if token is stolen

### 4. Active Status Check
```javascript
if (!user || !user.isActive) {
  return done(null, false);
}
```
- Disabled users can't login
- Even if they have a valid token

### 5. Role Validation at Multiple Levels
- Database level: `enum: ["ADMIN", "STAFF"]`
- Middleware level: `authorizeRoles()`
- Can't bypass by changing token

---

## Debugging Tips

### Problem: Always getting 401 Unauthorized

**Check:**
1. Is token included in header?
   ```
   Authorization: Bearer TOKEN
   ```
   (Note: Space after "Bearer")

2. Is token expired?
   - Login again to get fresh token

3. Is server using correct JWT_SECRET?
   - Check .env file

### Problem: Getting 403 Access Denied

**Check:**
1. What is your user role?
   ```
   GET /api/auth/me
   ```

2. What role does the route require?
   - Check route file for `authorizeRoles()`

3. Login with correct role user

### Problem: Token works but req.user is undefined

**Check:**
- `passport.authenticate()` must run BEFORE accessing `req.user`
- Check route order

---

## Summary

**The Complete Authorization Flow:**

1. **Register:** User created with role (ADMIN/STAFF)
2. **Login:** User gets JWT token containing ID and role
3. **Request:** User sends token in Authorization header
4. **Authentication:** passport.jwt.js verifies token and attaches user to req
5. **Authorization:** role.middleware.js checks if user's role is allowed
6. **Execute:** If all checks pass, controller function runs

**Key Files:**
- [user.model.js](models/user.model.js) - Defines user structure and roles
- [passport.local.js](modules/auth/passport.local.js) - Verifies email/password on login
- [passport.jwt.js](modules/auth/passport.jwt.js) - Verifies JWT token on API requests
- [auth.service.js](modules/auth/auth.service.js) - Generates JWT token
- [role.middleware.js](middlewares/role.middleware.js) - Checks user role permissions

**Two-Layer Security:**
- Layer 1: Are you logged in? (JWT Authentication)
- Layer 2: Are you allowed? (Role Authorization)

Both layers must pass for request to succeed!