// middleware/permission.middleware.js

export const checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || [];

    // superadmin
    if (userPermissions.includes("*")) {
      return next();
    }

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};