# Role Admin CRUD API Documentation

## Overview

The Role Admin CRUD API provides comprehensive management of system and custom roles with permission assignment. Admins can create, read, update, delete roles, and assign permissions with full audit logging support.

## Base URL

```
/api/admin/v1/roles
```

## Authentication

All endpoints require:
- **Bearer Token**: Valid JWT token in `Authorization` header
- **Permissions**: Specific permission checks for each operation

---

## Request Formats & Examples

### 1. Create Role

**Endpoint:** `POST /api/admin/v1/roles`

**Required Permission:** `role.create`

**Request Format:**
```json
{
  "name": "seller",
  "displayName": "Product Seller",
  "description": "Role for sellers to manage their products",
  "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1", "63f1a2b3c4d5e6f7g8h9i0j2"]
}
```

**Field Descriptions:**
- `name` (string, required): Unique role name, 2-60 chars, will be lowercased
- `displayName` (string, required): Display name, 2-80 chars
- `description` (string, optional): Role description, max 300 chars
- `permissions` (array, optional): Array of permission ObjectIds

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/admin/v1/roles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "seller",
    "displayName": "Product Seller",
    "description": "Role for sellers to manage their products",
    "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1"]
  }'
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Role created successfully.",
  "result": {
    "role": {
      "_id": "63f1a2b3c4d5e6f7g8h9i0j3",
      "name": "seller",
      "displayName": "Product Seller",
      "description": "Role for sellers to manage their products",
      "permissions": [
        {
          "_id": "63f1a2b3c4d5e6f7g8h9i0j1",
          "key": "product.create",
          "module": "product",
          "action": "create"
        }
      ],
      "permissionCount": 1,
      "isSystem": false,
      "isDefault": false,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

### 2. Get All Roles

**Endpoint:** `GET /api/admin/v1/roles`

**Required Permission:** `role.read_all`

**Query Parameters:**
```
page      - Page number (default: 1)
limit     - Items per page (default: 20, max: 100)
isSystem  - Filter by system role (true/false)
isActive  - Filter by active status (true/false)
search    - Search by name, displayName, or description
```

**Request Format:**
```
GET /api/admin/v1/roles?page=1&limit=20&isActive=true&search=seller
```

**cURL Example:**
```bash
curl "http://localhost:3000/api/admin/v1/roles?page=1&limit=10&isActive=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Roles fetched successfully.",
  "result": {
    "roles": [
      {
        "_id": "63f1a2b3c4d5e6f7g8h9i0j3",
        "name": "seller",
        "displayName": "Product Seller",
        "description": "Role for sellers",
        "permissions": [
          {
            "_id": "63f1a2b3c4d5e6f7g8h9i0j1",
            "key": "product.create",
            "module": "product",
            "action": "create"
          }
        ],
        "permissionCount": 1,
        "isSystem": false,
        "isDefault": false,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

---

### 3. Get Role by ID

**Endpoint:** `GET /api/admin/v1/roles/:id`

**Required Permission:** `role.read`

**Path Parameters:**
```
id - Role ID (MongoDB ObjectId)
```

**Request Format:**
```
GET /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3
```

**cURL Example:**
```bash
curl http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Role fetched successfully.",
  "result": {
    "role": {
      "_id": "63f1a2b3c4d5e6f7g8h9i0j3",
      "name": "seller",
      "displayName": "Product Seller",
      "description": "Role for sellers",
      "permissions": [
        {
          "_id": "63f1a2b3c4d5e6f7g8h9i0j1",
          "key": "product.create",
          "module": "product",
          "action": "create"
        }
      ],
      "permissionCount": 1,
      "isSystem": false,
      "isDefault": false,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

### 4. Update Role

**Endpoint:** `PATCH /api/admin/v1/roles/:id`

**Required Permission:** `role.update`

**Path Parameters:**
```
id - Role ID (MongoDB ObjectId)
```

**Request Format:**
```json
{
  "displayName": "Updated Seller Role",
  "description": "Updated description",
  "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1", "63f1a2b3c4d5e6f7g8h9i0j2"],
  "isActive": true
}
```

**Field Descriptions:**
- `displayName` (string, optional): New display name
- `description` (string, optional): New description
- `permissions` (array, optional): New permissions array (replaces existing)
- `isActive` (boolean, optional): Active status

**Notes:**
- System roles cannot have their name changed
- At least one field must be provided
- Permissions are replaced, not merged (use /permissions endpoint for granular control)

**cURL Example:**
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Advanced Seller",
    "isActive": true
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Role updated successfully.",
  "result": {
    "role": {
      "_id": "63f1a2b3c4d5e6f7g8h9i0j3",
      "name": "seller",
      "displayName": "Advanced Seller",
      "description": "Role for sellers",
      "permissions": [
        {
          "_id": "63f1a2b3c4d5e6f7g8h9i0j1",
          "key": "product.create",
          "module": "product",
          "action": "create"
        }
      ],
      "permissionCount": 1,
      "isSystem": false,
      "isDefault": false,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:35:00Z"
    }
  }
}
```

---

### 5. Delete Role

**Endpoint:** `DELETE /api/admin/v1/roles/:id`

**Required Permission:** `role.delete`

**Path Parameters:**
```
id - Role ID (MongoDB ObjectId)
```

**Request Format:**
```
DELETE /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3
```

**Notes:**
- System roles cannot be deleted
- Default roles cannot be deleted (assign another role as default first)

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Role deleted successfully."
}
```

---

### 6. Assign Permissions to Role

**Endpoint:** `PATCH /api/admin/v1/roles/:id/permissions`

**Required Permission:** `role.assign_permissions`

**Path Parameters:**
```
id - Role ID (MongoDB ObjectId)
```

**Request Format:**
```json
{
  "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1", "63f1a2b3c4d5e6f7g8h9i0j2"],
  "action": "set"
}
```

**Field Descriptions:**
- `permissions` (array, required): Array of permission ObjectIds
- `action` (string, optional): One of:
  - `"set"` (default) - Replace all permissions
  - `"add"` - Add new permissions to existing
  - `"remove"` - Remove specified permissions

**cURL Examples:**

**Set (replace) permissions:**
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/permissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1", "63f1a2b3c4d5e6f7g8h9i0j2"],
    "action": "set"
  }'
```

**Add permissions:**
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/permissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["63f1a2b3c4d5e6f7g8h9i0j3"],
    "action": "add"
  }'
```

**Remove permissions:**
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/permissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1"],
    "action": "remove"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Permissions assigned successfully.",
  "result": {
    "role": {
      "_id": "63f1a2b3c4d5e6f7g8h9i0j3",
      "name": "seller",
      "displayName": "Product Seller",
      "permissions": [
        {
          "_id": "63f1a2b3c4d5e6f7g8h9i0j1",
          "key": "product.create",
          "module": "product",
          "action": "create"
        },
        {
          "_id": "63f1a2b3c4d5e6f7g8h9i0j2",
          "key": "product.read",
          "module": "product",
          "action": "read"
        }
      ],
      "permissionCount": 2,
      "isSystem": false,
      "isDefault": false,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:40:00Z"
    }
  }
}
```

---

### 7. Bulk Update Role Status

**Endpoint:** `PATCH /api/admin/v1/roles/bulk/status`

**Required Permission:** `role.update`

**Request Format:**
```json
{
  "ids": ["63f1a2b3c4d5e6f7g8h9i0j3", "63f1a2b3c4d5e6f7g8h9i0j4"],
  "isActive": true
}
```

**Field Descriptions:**
- `ids` (array, required): Array of role IDs, at least 1 required
- `isActive` (boolean, required): Active status to set for all roles

**Notes:**
- System roles status cannot be changed
- Will throw error if any role is a system role

**cURL Example:**
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/bulk/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["63f1a2b3c4d5e6f7g8h9i0j3", "63f1a2b3c4d5e6f7g8h9i0j4"],
    "isActive": false
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Roles updated successfully.",
  "result": {
    "matchedCount": 2,
    "modifiedCount": 2
  }
}
```

---

### 8. Set Role as Default

**Endpoint:** `PATCH /api/admin/v1/roles/:id/set-default`

**Required Permission:** `role.update`

**Path Parameters:**
```
id - Role ID (MongoDB ObjectId)
```

**Request Format:**
```
PATCH /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/set-default
```

**Notes:**
- Only one role can be default
- Setting a role as default removes default from all other roles

**cURL Example:**
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/set-default \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Role set as default successfully.",
  "result": {
    "role": {
      "_id": "63f1a2b3c4d5e6f7g8h9i0j3",
      "name": "seller",
      "displayName": "Product Seller",
      "description": "Role for sellers",
      "permissions": [...],
      "permissionCount": 1,
      "isSystem": false,
      "isDefault": true,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:45:00Z"
    }
  }
}
```

---

### 9. Get Default Role

**Endpoint:** `GET /api/admin/v1/roles/default`

**Required Permission:** `role.read`

**Request Format:**
```
GET /api/admin/v1/roles/default
```

**cURL Example:**
```bash
curl http://localhost:3000/api/admin/v1/roles/default \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Default role fetched successfully.",
  "result": {
    "role": {
      "_id": "63f1a2b3c4d5e6f7g8h9i0j3",
      "name": "seller",
      "displayName": "Product Seller",
      "description": "Role for sellers",
      "permissions": [...],
      "permissionCount": 1,
      "isSystem": false,
      "isDefault": true,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:45:00Z"
    }
  }
}
```

---

### 10. Get System Roles

**Endpoint:** `GET /api/admin/v1/roles/system/list`

**Required Permission:** `role.read_all`

**Request Format:**
```
GET /api/admin/v1/roles/system/list
```

**cURL Example:**
```bash
curl http://localhost:3000/api/admin/v1/roles/system/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "System roles fetched successfully.",
  "result": {
    "roles": [
      {
        "_id": "63f1a2b3c4d5e6f7g8h9i0jA",
        "name": "superadmin",
        "displayName": "Super Administrator",
        "description": "Full system access",
        "permissions": [...],
        "permissionCount": 50,
        "isSystem": true,
        "isDefault": false,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "_id": "63f1a2b3c4d5e6f7g8h9i0jB",
        "name": "admin",
        "displayName": "Administrator",
        "description": "Administrative access",
        "permissions": [...],
        "permissionCount": 40,
        "isSystem": true,
        "isDefault": false,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "count": 2
  }
}
```

---

## Role Model Schema

```javascript
{
  _id: ObjectId,
  name: String (unique, required, lowercase),
  displayName: String (required),
  description: String (optional),
  permissions: [ObjectId] (refs Permission model),
  permissionCount: Number (virtual),
  isSystem: Boolean (default: false),
  isDefault: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## Error Codes & Responses

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid input data, missing required fields, or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions or cannot modify system/default roles |
| 404 | Not Found | Role not found or no default role set |
| 409 | Conflict | Role name already exists |
| 500 | Server Error | Internal server error |

**Error Response Format:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error message"
}
```

---

## Key Features

✅ **System Role Protection** - Cannot modify/delete system roles (only status changes)  
✅ **Default Role Management** - Set and retrieve default roles  
✅ **Flexible Permission Management** - Set, add, or remove permissions  
✅ **Audit Logging** - All changes logged with before/after comparison  
✅ **Unique Name Validation** - Prevents duplicate role names  
✅ **Bulk Operations** - Update status for multiple roles at once  
✅ **Pagination Support** - Max 100 items per page  
✅ **Flexible Filtering** - Filter by system status, active status, or search  
✅ **Permission-based Access** - Each endpoint requires specific permissions  

---

## Required Permissions

- `role.create` - Create roles
- `role.read` - Read individual role
- `role.read_all` - Read all roles
- `role.update` - Update roles and set default
- `role.delete` - Delete roles
- `role.assign_permissions` - Assign permissions to roles

---

## Common Workflows

### 1. Create a complete role with permissions

```bash
# First, get permission IDs
curl "http://localhost:3000/api/admin/v1/permissions/module/product" \
  -H "Authorization: Bearer TOKEN"

# Then create role with those permissions
curl -X POST http://localhost:3000/api/admin/v1/roles \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "seller",
    "displayName": "Product Seller",
    "description": "Can manage products",
    "permissions": ["ID1", "ID2", "ID3"]
  }'
```

### 2. Add more permissions to an existing role

```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/ROLE_ID/permissions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["PERMISSION_ID1", "PERMISSION_ID2"],
    "action": "add"
  }'
```

### 3. Set a new default role

```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/ROLE_ID/set-default \
  -H "Authorization: Bearer TOKEN"
```

### 4. Deactivate multiple roles

```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/bulk/status \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["ROLE_ID1", "ROLE_ID2"],
    "isActive": false
  }'
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination starts from page 1
- Limit is capped at 100 items per page for performance
- Use `isSystem: true` for system roles (superadmin, admin, etc.)
- Use `isDefault: true` only for the default new user role
- Role names are automatically lowercased
- Permission arrays are deduplicated automatically
