# Role Admin API - Quick Reference

## Base URL
```
/api/admin/v1/roles
```

## Endpoints Summary

| Method | Endpoint | Permission | Description |
|--------|----------|-----------|-------------|
| POST | `/` | `role.create` | Create role |
| GET | `/` | `role.read_all` | Get all roles |
| GET | `/:id` | `role.read` | Get role by ID |
| PATCH | `/:id` | `role.update` | Update role |
| DELETE | `/:id` | `role.delete` | Delete role |
| PATCH | `/:id/permissions` | `role.assign_permissions` | Assign permissions |
| PATCH | `/:id/set-default` | `role.update` | Set as default |
| PATCH | `/bulk/status` | `role.update` | Bulk update status |
| GET | `/default` | `role.read` | Get default role |
| GET | `/system/list` | `role.read_all` | Get system roles |

---

## Quick Request Examples

### 1️⃣ CREATE ROLE
```json
POST /api/admin/v1/roles
{
  "name": "seller",
  "displayName": "Product Seller",
  "description": "Sellers managing products",
  "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1"]
}
```

### 2️⃣ GET ALL ROLES
```
GET /api/admin/v1/roles?page=1&limit=20&isActive=true&search=seller
```

### 3️⃣ GET ROLE BY ID
```
GET /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3
```

### 4️⃣ UPDATE ROLE
```json
PATCH /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3
{
  "displayName": "Advanced Seller",
  "description": "Updated description",
  "isActive": true
}
```

### 5️⃣ DELETE ROLE
```
DELETE /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3
```

### 6️⃣ ASSIGN PERMISSIONS (SET)
```json
PATCH /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/permissions
{
  "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1", "63f1a2b3c4d5e6f7g8h9i0j2"],
  "action": "set"
}
```

### 6️⃣ ASSIGN PERMISSIONS (ADD)
```json
PATCH /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/permissions
{
  "permissions": ["63f1a2b3c4d5e6f7g8h9i0j3"],
  "action": "add"
}
```

### 6️⃣ ASSIGN PERMISSIONS (REMOVE)
```json
PATCH /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/permissions
{
  "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1"],
  "action": "remove"
}
```

### 7️⃣ SET AS DEFAULT
```
PATCH /api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/set-default
```

### 8️⃣ GET DEFAULT ROLE
```
GET /api/admin/v1/roles/default
```

### 9️⃣ GET SYSTEM ROLES
```
GET /api/admin/v1/roles/system/list
```

### 🔟 BULK UPDATE STATUS
```json
PATCH /api/admin/v1/roles/bulk/status
{
  "ids": ["63f1a2b3c4d5e6f7g8h9i0j3", "63f1a2b3c4d5e6f7g8h9i0j4"],
  "isActive": false
}
```

---

## Query Parameters

### Get All Roles
```
?page=1              # Page number (default: 1)
&limit=20            # Items per page (default: 20, max: 100)
&isSystem=true       # Filter by system role (true/false)
&isActive=true       # Filter by active status (true/false)
&search=seller       # Search in name, displayName, description
```

**Example:**
```
GET /api/admin/v1/roles?page=1&limit=10&isActive=true&search=seller
```

---

## Field Validation

### Create/Update Role Fields

**name** (Create Only)
- Type: `string`
- Required: Yes
- Min length: 2 characters
- Max length: 60 characters
- Lowercase: Yes
- Unique: Yes

**displayName**
- Type: `string`
- Required: Yes (on create)
- Min length: 2 characters
- Max length: 80 characters
- Trim: Yes

**description**
- Type: `string`
- Required: No
- Max length: 300 characters
- Trim: Yes

**permissions**
- Type: `array of ObjectIds`
- Required: No
- Each item: Must be valid Permission ID

**isActive**
- Type: `boolean`
- Default: `true`
- Constraints: Cannot change for system roles

---

## Response Structure

### Success Response
```json
{
  "success": true,
  "statusCode": 200 | 201,
  "message": "Operation successful",
  "result": {
    "role": { /* role object */ },
    "pagination": { /* if applicable */ }
  }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400 | 401 | 403 | 404 | 409,
  "message": "Error description"
}
```

---

## HTTP Status Codes

| Code | Meaning | Typical Reason |
|------|---------|---|
| 200 | OK | Request successful (GET, PATCH, DELETE) |
| 201 | Created | Resource created successfully (POST) |
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate role name |
| 500 | Server Error | Unexpected server error |

---

## Common Error Messages

```json
{
  "success": false,
  "statusCode": 409,
  "message": "Role with this name already exists."
}
```

```json
{
  "success": false,
  "statusCode": 403,
  "message": "System roles cannot be deleted."
}
```

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Default role cannot be deleted. Assign another role as default first."
}
```

```json
{
  "success": false,
  "statusCode": 400,
  "message": "One or more permission IDs are invalid."
}
```

---

## Header Requirements

All requests must include:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## Complete cURL Examples

### Create Role with Permissions
```bash
curl -X POST http://localhost:3000/api/admin/v1/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "seller",
    "displayName": "Product Seller",
    "description": "Role for sellers to manage their products",
    "permissions": ["63f1a2b3c4d5e6f7g8h9i0j1", "63f1a2b3c4d5e6f7g8h9i0j2"]
  }'
```

### Get All Roles with Pagination
```bash
curl "http://localhost:3000/api/admin/v1/roles?page=1&limit=10&isActive=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Role
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Advanced Seller",
    "isActive": true
  }'
```

### Add Permissions to Role
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["63f1a2b3c4d5e6f7g8h9i0j4"],
    "action": "add"
  }'
```

### Set Role as Default
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3/set-default \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete Role
```bash
curl -X DELETE http://localhost:3000/api/admin/v1/roles/63f1a2b3c4d5e6f7g8h9i0j3 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Bulk Deactivate Roles
```bash
curl -X PATCH http://localhost:3000/api/admin/v1/roles/bulk/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["63f1a2b3c4d5e6f7g8h9i0j3", "63f1a2b3c4d5e6f7g8h9i0j4"],
    "isActive": false
  }'
```

---

## Notes

- All IDs are MongoDB ObjectIds (24-character hex strings)
- Timestamps are in ISO 8601 format (UTC timezone)
- Role names are automatically converted to lowercase
- System roles cannot be deleted or have their name changed
- Default roles cannot be deleted
- Only one role can be set as default at a time
- Permission arrays are automatically deduplicated
- Maximum 100 items returned per page
