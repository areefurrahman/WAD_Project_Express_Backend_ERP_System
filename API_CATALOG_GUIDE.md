# API Catalog - Complete User Guide

## Access the Catalog
Open in browser: `http://localhost:3000/`

---

## What I Fixed

### 1. Copy Button in View Examples
- Now works properly when you click "View Examples" and copy request/response data

### 2. Editable Endpoint
- You can now edit the endpoint URL in the test modal
- Useful for dynamic routes like `/api/users/:id`
- Example: Change `/api/users/:id` to `/api/users/507f1f77bcf86cd799439011`

### 3. Role Badges Explained

| Badge | Meaning | Token Required? |
|-------|---------|----------------|
| **PUBLIC** | Anyone can access (register, login) | No |
| **ADMIN** | Only ADMIN role users can access | Yes (Admin only) |
| **ALL** | Any logged-in user (ADMIN or STAFF) | Yes (Any user) |

---

## How to Use

### Quick Start (First Time)

**1. Register Admin User**
- Find "Authentication" module in left sidebar
- Click "Test API" on `POST /api/auth/register`
- Request body is already filled, just click "Send Request"
- Check Response tab for success

**2. Login to Get Token**
- Click "Test API" on `POST /api/auth/login`
- Use same email/password from registration
- Click "Send Request"
- Token is **automatically saved** - check header status turns green

**3. Test Other APIs**
- Now you can test any API
- Token is automatically included in all requests

---

## Testing APIs with Dynamic IDs

### Example: Get User by ID

1. First, create or get a user to find their ID
2. Click "Test API" on `GET /api/users/:id`
3. **Edit the endpoint field**: Change `/api/users/:id` to `/api/users/507f1f77bcf86cd799439011`
4. Click "Send Request"
5. See response

### Common Dynamic Endpoints:
- `/api/users/:id` → `/api/users/507f1f77bcf86cd799439011`
- `/api/products/:id` → `/api/products/507f1f77bcf86cd799439020`
- `/api/customers/:id` → `/api/customers/507f1f77bcf86cd799439030`
- `/api/sales/:id` → `/api/sales/507f1f77bcf86cd799439040`

---

## Features

### 1. View Examples Button
- Click to expand/collapse
- Shows Request Body format
- Shows Response Example
- Copy buttons for easy copying

### 2. Copy URL Button
- Copies full endpoint URL to clipboard
- Format: `http://localhost:3000/api/...`

### 3. Test API Button
- Opens interactive testing modal
- Pre-fills request body with sample data
- Edit endpoint for dynamic routes
- Edit request body JSON
- Automatic token inclusion
- Auto-saves token from login response

### 4. Search
- Type in search box to filter APIs
- Searches in endpoint, description, and module names

### 5. Module Navigation
- Click any module name in left sidebar
- Smoothly scrolls to that section

### 6. Token Management
- Click key icon in header
- Paste/save token manually
- Clear token
- Auto-saved on login

### 7. Theme Toggle
- Click moon icon in header
- Switch between dark/light themes

---

## Testing Workflow Example

### Scenario: Create and View Products

**Step 1: Login**
1. Test `POST /api/auth/login`
2. Token auto-saved

**Step 2: Create Product**
1. Test `POST /api/products`
2. Default body:
   ```json
   {
     "name": "Samsung Galaxy A54",
     "salePrice": 85000,
     "quantity": 50
   }
   ```
3. Click "Send Request"
4. Copy the `_id` from response

**Step 3: Get Product by ID**
1. Test `GET /api/products/:id`
2. Edit endpoint: `/api/products/PASTE_ID_HERE`
3. Click "Send Request"
4. See your created product

**Step 4: Update Product**
1. Test `PUT /api/products/:id`
2. Edit endpoint with product ID
3. Edit request body to update fields
4. Click "Send Request"

**Step 5: Get All Products**
1. Test `GET /api/products`
2. Click "Send Request"
3. See all products including your new one

---

## API Testing Tips

### 1. Getting IDs for Testing
- Always copy the `_id` from create responses
- Use "Get All" endpoints first to see available IDs
- Example: Use `GET /api/customers` to get customer IDs for sales

### 2. Order of Operations
1. Create expense categories before expenses
2. Create products before sales
3. Create customers before sales
4. Create sales before returns

### 3. Role-Based Testing
- **PUBLIC** endpoints work without token
- **ADMIN** endpoints need admin user token
- **ALL** endpoints work with any logged-in user
- Test with different user roles to verify permissions

### 4. Common Errors
- **401 Unauthorized**: Token missing or invalid - login again
- **403 Forbidden**: Wrong role - use ADMIN user
- **404 Not Found**: Wrong endpoint or ID doesn't exist
- **500 Server Error**: Check console logs on server

---

## Module Overview

| Module | APIs | Key Features |
|--------|------|--------------|
| Authentication | 3 | Register, Login, Get Profile |
| User Management | 5 | Create, List, Get, Update, Disable users |
| Product Management | 4 | CRUD operations, stock tracking |
| Customer Management | 4 | CRUD operations, balance tracking |
| Sales | 3 | Create sales, auto stock decrease |
| Stock Logs | 1 | View stock movement history |
| Expense Categories | 5 | CRUD operations for categories |
| Expenses | 6 | CRUD operations, date-filtered reports |
| Returns | 5 | Sale returns, auto stock restore |
| Reports | 4 | Daily/monthly sales, top products |
| System Logs | 5 | Activity logging, cleanup |

**Total: 45+ APIs across 11 modules**

---

## Color Codes

### Method Badges
- **Green** = GET (retrieve data)
- **Blue** = POST (create new)
- **Orange** = PUT/PATCH (update existing)
- **Red** = DELETE (remove)

### Role Badges
- **Cyan** = PUBLIC
- **Red** = ADMIN only
- **Green** = ALL users

---

## Keyboard Shortcuts
- **Ctrl + F5**: Hard refresh (clear cache)
- **Esc**: Close modal (planned feature)
- **Ctrl + K**: Focus search box (planned feature)

---

## Troubleshooting

### API Catalog Not Loading
1. Ensure server is running: `npm start`
2. Access via: `http://localhost:3000/`
3. Check browser console (F12) for errors

### Token Not Working
1. Check if token status shows green
2. Re-login to get fresh token
3. Token expires after 1 hour (default JWT expiry)

### Can't Edit Endpoint
1. Click inside the endpoint input field
2. Replace `:id` with actual MongoDB ObjectId
3. Format: 24-character hex string

### Copy Button Not Working
1. Ensure HTTPS or localhost (clipboard API requirement)
2. Check browser clipboard permissions
3. Try hard refresh (Ctrl + F5)

---

## Technical Details

### File Structure
```
public/
├── data/
│   └── api-catalog.json       # All API metadata
├── css/
│   └── api-catalog.css        # Dark theme styling
├── js/
│   └── api-catalog.js         # Interactive functionality
└── index.html                 # Main catalog page
```

### Technologies Used
- HTML5
- CSS3 (CSS Variables for theming)
- Vanilla JavaScript (ES6+)
- Font Awesome 6.5.1
- LocalStorage for token persistence
- Fetch API for HTTP requests

### Browser Support
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

---

## What Makes This Special

1. **Zero Dependencies**: No React, Vue, or frameworks
2. **Simple Code**: Beginner-friendly, easy to understand
3. **Pakistani Context**: Sample data with Pakistani names, cities, PKR
4. **Hybrid Approach**: Both documentation and interactive testing
5. **Auto Token Management**: Saves token automatically from login
6. **Editable Endpoints**: Test dynamic routes easily
7. **Real-time Validation**: Instant feedback on errors
8. **Beautiful UI**: Modern dark theme with color coding

---

## Project Status

**Production Ready**
- All 11 modules implemented
- 45+ APIs fully functional
- Complete documentation
- Interactive testing tool
- Sample data available

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify MongoDB is running
3. Check server is running on port 3000
4. Review API_TESTING_GUIDE.md for backend details