/**
 * @swagger
 * tags:
 *   - name: Admin - Roles
 *     description: Role management endpoints for admins
 */

/**
 * @swagger
 * /admin/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, displayName]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "seller"
 *                 description: Unique role name (lowercase)
 *               displayName:
 *                 type: string
 *                 example: "Product Seller"
 *                 description: Display name for the role
 *               description:
 *                 type: string
 *                 example: "Role for sellers to manage their products"
 *                 description: Optional role description
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["63f1a2b3c4d5e6f7g8h9i0j1", "63f1a2b3c4d5e6f7g8h9i0j2"]
 *                 description: Array of permission IDs
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Role created successfully."
 *                 result:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Role already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */

/**
 * @swagger
 * /admin/roles:
 *   get:
 *     summary: Get all roles with pagination
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Items per page (max 100)
 *       - in: query
 *         name: isSystem
 *         schema:
 *           type: boolean
 *         description: Filter by system role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, displayName, or description
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /admin/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/roles/{id}:
 *   patch:
 *     summary: Update role
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               description:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *       403:
 *         description: Cannot modify system roles
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/roles/{id}:
 *   delete:
 *     summary: Delete role
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       403:
 *         description: Cannot delete system or default roles
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/roles/{id}/permissions:
 *   patch:
 *     summary: Assign permissions to role
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permissions]
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["63f1a2b3c4d5e6f7g8h9i0j1", "63f1a2b3c4d5e6f7g8h9i0j2"]
 *               action:
 *                 type: string
 *                 enum: [set, add, remove]
 *                 default: set
 *                 description: "set - replace all permissions, add - add new permissions, remove - remove permissions"
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 *       404:
 *         description: Role not found
 *       400:
 *         description: Invalid permission IDs
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/roles/{id}/set-default:
 *   patch:
 *     summary: Set role as default
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role set as default successfully
 *       404:
 *         description: Role not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/roles/bulk/status:
 *   patch:
 *     summary: Bulk update role status
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids, isActive]
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["63f1a2b3c4d5e6f7g8h9i0j1", "63f1a2b3c4d5e6f7g8h9i0j2"]
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Roles updated successfully
 *       403:
 *         description: Cannot change system roles status
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/roles/system/list:
 *   get:
 *     summary: Get all system roles
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System roles fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 *                     count:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/roles/default:
 *   get:
 *     summary: Get default role
 *     tags: [Admin - Roles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Default role fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       404:
 *         description: No default role set
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "63f1a2b3c4d5e6f7g8h9i0j1"
 *         name:
 *           type: string
 *           example: "seller"
 *         displayName:
 *           type: string
 *           example: "Product Seller"
 *         description:
 *           type: string
 *           example: "Role for sellers to manage their products"
 *         permissions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               key:
 *                 type: string
 *               module:
 *                 type: string
 *               action:
 *                 type: string
 *           example:
 *             - _id: "63f1a2b3c4d5e6f7g8h9i0j1"
 *               key: "product.create"
 *               module: "product"
 *               action: "create"
 *         permissionCount:
 *           type: number
 *           example: 5
 *         isSystem:
 *           type: boolean
 *           example: false
 *         isDefault:
 *           type: boolean
 *           example: false
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           example: 100
 *         page:
 *           type: number
 *           example: 1
 *         limit:
 *           type: number
 *           example: 20
 *         pages:
 *           type: number
 *           example: 5
 */

export default {};
