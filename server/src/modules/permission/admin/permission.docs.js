/**
 * @swagger
 * tags:
 *   - name: Admin - Permissions
 *     description: Permission management endpoints for admins
 */

/**
 * @swagger
 * /admin/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Admin - Permissions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, module, action]
 *             properties:
 *               key:
 *                 type: string
 *                 example: "product.create"
 *                 description: Unique permission key in dot notation
 *               module:
 *                 type: string
 *                 example: "product"
 *                 description: Module name
 *               action:
 *                 type: string
 *                 example: "create"
 *                 description: Action name
 *               description:
 *                 type: string
 *                 example: "Allows creating new products"
 *                 description: Optional permission description
 *     responses:
 *       201:
 *         description: Permission created successfully
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
 *                   example: "Permission created successfully."
 *                 result:
 *                   type: object
 *                   properties:
 *                     permission:
 *                       $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Permission already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */

/**
 * @swagger
 * /admin/permissions:
 *   get:
 *     summary: Get all permissions with pagination
 *     tags: [Admin - Permissions]
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
 *         name: module
 *         schema:
 *           type: string
 *         description: Filter by module
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by key, module, or description
 *     responses:
 *       200:
 *         description: Permissions fetched successfully
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
 *                     permissions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Permission'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /admin/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Admin - Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission fetched successfully
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
 *                     permission:
 *                       $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/permissions/{id}:
 *   patch:
 *     summary: Update permission
 *     tags: [Admin - Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module:
 *                 type: string
 *               action:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Permission updated successfully
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
 *                     permission:
 *                       $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 *       403:
 *         description: Cannot modify system permissions
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/permissions/{id}:
 *   delete:
 *     summary: Delete permission
 *     tags: [Admin - Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       403:
 *         description: Cannot delete system permissions
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/permissions/bulk/status:
 *   patch:
 *     summary: Bulk update permission status
 *     tags: [Admin - Permissions]
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
 *                 example: ["123456789", "987654321"]
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Permissions updated successfully
 *       403:
 *         description: Cannot change system permissions status
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/permissions/module/{module}:
 *   get:
 *     summary: Get permissions by module
 *     tags: [Admin - Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: module
 *         required: true
 *         schema:
 *           type: string
 *         description: Module name (e.g., "product", "order", "user")
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Permissions fetched successfully
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
 *                     module:
 *                       type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Permission'
 *       404:
 *         description: No permissions found for this module
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/permissions/modules/list:
 *   get:
 *     summary: Get all available modules
 *     tags: [Admin - Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter modules by active permissions
 *     responses:
 *       200:
 *         description: Modules fetched successfully
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
 *                     modules:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["product", "order", "user", "role"]
 *                     count:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "63f1a2b3c4d5e6f7g8h9i0j1"
 *         key:
 *           type: string
 *           example: "product.create"
 *         module:
 *           type: string
 *           example: "product"
 *         action:
 *           type: string
 *           example: "create"
 *         description:
 *           type: string
 *           example: "Allows creating new products"
 *         isSystem:
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
