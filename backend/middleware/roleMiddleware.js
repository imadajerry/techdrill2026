const { fail } = require('../utils/responseHelper');

/**
 * Role-based access control middleware.
 * Usage: requireRole('admin', 'superadmin')
 * Must be used AFTER verifyToken middleware.
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return fail(res, 'Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return fail(res, 'You do not have permission to access this resource.', 403);
    }

    next();
  };
}

module.exports = requireRole;
