# Permission Admin CRUD API Documentation

## Overview

The Permission Admin CRUD API provides comprehensive management of system and custom permissions. Admins can create, read, update, and delete permissions with full audit logging support.

## Base URL

```
/api/admin/v1/permissions
```

## Authentication

All endpoints require:
- **Bearer Token**: Valid JWT token in `Authorization` header
- **Permissions**: Specific permission checks for each operation

## Endpoints

### 1. Create Permission

**Endpoint:** `POST /api/admin/v1/permissions`

**Required Permission:** `permission.create`

**Request Body:**
```json
{
  "key": "product.publish",
  "module": "product",
  "action": "publish",
  "description": "Allows publishing products"
}
```

**Query Parameters:**
None

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Permission created successfully.",
  "result": {
    "permission": {
      "_id": "507f1f77bcf86cd799439011",
      "key": "product.publish",
      "module": "product",
      "action": "publish",
      "description": "Allows publishing products",
      "isSystem": false,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**
- `400`: Invalid input data
- `409`: Permission with this key already exists
- `403`: Insufficient permissions

---

### 2. Get All Permissions

**Endpoint:** `GET /api/admin/v1/permissions`

**Required Permission:** `permission.read_all`

**Query Parameters:**
```
page        - Page number (default: 1)
limit       - Items per page (default: 20, max: 100)
module      - Filter by module (e.g., "product", "order")
isActive    - Filter by status (true/false)
search      - Search by key, module, or description
```

**Example Request:**
```
GET /api/admin/v1/permissions?page=1&limit=20&module=product&isActive=true&search=create
```

**Response (200):**
```json
{
  "success": true,
  "message": "Permissions fetched successfully.",
  "result": {
    "permissions": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "key": "product.create",
        "module": "product",
        "action": "create",
        "description": "Create products",
        "isSystem": true,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "key": "product.publish",
        "module": "product",
        "action": "publish",
        "description": "Publish products",
        "isSystem": false,
        "isActive": true,
        "createdAt": "2024-01-15T10:31:00Z",
        "updatedAt": "2024-01-15T10:31:00Z"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

---

### 3. Get Permission by ID

**Endpoint:** `GET /api/admin/v1/permissions/:id`

**Required Permission:** `permission.read`

**Path Parameters:**
```
id - Permission ID (MongoDB ObjectId)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Permission fetched successfully.",
  "result": {
    "permission": {
      "_id": "507f1f77bcf86cd799439011",
      "key": "product.create",
      "module": "product",
      "action": "create",
      "description": "Create products",
      "isSystem": true,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**
- `404`: Permission not found
- `403`: Insufficient permissions

---

### 4. Update Permission

**Endpoint:** `PATCH /api/admin/v1/permissions/:id`

**Required Permission:** `permission.update`

**Path Parameters:**
```
id - Permission ID (MongoDB ObjectId)
```

**Request Body:**
```json
{
  "description": "Updated description",
  "isActive": false
}
```

**Notes:**
- System permissions (where `isSystem: true`) cannot have their `module` or `action` modified
- Only `description` and `isActive` can be changed for system permissions
- At least one field must be provided

**Response (200):**
```json
{
  "success": true,
  "message": "Permission updated successfully.",
  "result": {
    "permission": {
      "_id": "507f1f77bcf86cd799439011",
      "key": "product.create",
      "module": "product",
      "action": "create",
      "description": "Updated description",
      "isSystem": true,
      "isActive": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:35:00Z"
    }
  }
}
```

**Error Responses:**
- `404`: Permission not found
- `403`: Cannot modify system permissions (for non-isActive fields)

---

### 5. Delete Permission

**Endpoint:** `DELETE /api/admin/v1/permissions/:id`

**Required Permission:** `permission.delete`

**Path Parameters:**
```
id - Permission ID (MongoDB ObjectId)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Permission deleted successfully."
}
```

**Error Responses:**
- `404`: Permission not found
- `403`: Cannot delete system permissions

---

### 6. Bulk Update Permission Status

**Endpoint:** `PATCH /api/admin/v1/permissions/bulk/status`

**Required Permission:** `permission.update`

**Request Body:**
```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "isActive": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Permissions updated successfully.",
  "result": {
    "matchedCount": 2,
    "modifiedCount": 2
  }
}
```

**Error Responses:**
- `400`: No permission IDs provided
- `403`: Cannot change system permissions status

---

### 7. Get Permissions by Module

**Endpoint:** `GET /api/admin/v1/permissions/module/:module`

**Required Permission:** `permission.read_all`

**Path Parameters:**
```
module - Module name (e.g., "product", "order", "user")
```

**Query Parameters:**
```
isActive - Filter by status (default: true)
```

**Example Request:**
```
GET /api/admin/v1/permissions/module/product?isActive=true
```

**Response (200):**
```json
{
  "success": true,
  "message": "Permissions fetched successfully.",
  "result": {
    "module": "product",
    "permissions": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "key": "product.create",
        "module": "product",
        "action": "create",
        "description": "Create products",
        "isSystem": true,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

**Error Responses:**
- `404`: No permissions found for this module

---

### 8. Get All Available Modules

**Endpoint:** `GET /api/admin/v1/permissions/modules/list`

**Required Permission:** `permission.read_all`

**Query Parameters:**
```
isActive - Filter modules by active permissions (optional)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Modules fetched successfully.",
  "result": {
    "modules": ["auth", "banner", "brand", "category", "coupon", "customer", "dashboard", "order", "permission", "product", "review", "role", "settings", "store", "user"],
    "count": 15
  }
}
```

---

## Permission Model Schema

```javascript
{
  _id: ObjectId,
  key: String (unique, required, enum: ALL_PERMISSIONS),
  module: String (required, indexed),
  action: String (required),
  description: String (optional, max 250 chars),
  isSystem: Boolean (default: true, indexed),
  isActive: Boolean (default: true, indexed),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## Key Features

### 1. **System Permission Protection**
- System permissions cannot be deleted
- System permissions can only have `description` and `isActive` modified
- Attempting to modify system permission structure returns 403 error

### 2. **Audit Logging**
- All create, update, delete, and bulk operations are logged
- Changes include before/after comparison
- User and request information is recorded

### 3. **Unique Key Constraint**
- Each permission must have a unique `key`
- Keys are automatically lowercased and trimmed
- Attempting to create duplicate key returns 409 error

### 4. **Flexible Filtering**
- Filter by module
- Filter by active status
- Search across key, module, and description
- Pagination support (max 100 items per page)

### 5. **Module Management**
- Get all available modules
- List permissions by module
- Bulk operations on permissions within a module

---

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid input data or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions or system permission protection |
| 404 | Not Found | Permission or resource not found |
| 409 | Conflict | Duplicate permission key |
| 500 | Server Error | Internal server error |

---

## Usage Examples

### Create a custom permission
```bash
curl -X POST http://localhost:3000/api/admin/v1/permissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "product.archive",
    "module": "product",
    "action": "archive",
    "description": "Archive products"
  }'
```

### Get all product permissions
```bash
curl http://localhost:3000/api/admin/v1/permissions/module/product \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Deactivate multiple permissions
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/permissions/bulk/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    "isActive": false
  }'
```

### Search permissions
```bash
curl "http://localhost:3000/api/admin/v1/permissions?search=create&module=product" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination starts from page 1
- Limit is capped at 100 items per page for performance
- Use `isSystem: true` to filter system permissions created by the platform
- Use `isSystem: false` to filter custom permissions created by admins
