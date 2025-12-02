/**
 * @fileoverview Admin authorization middleware
 */

/**
 * Middleware to check if user is admin
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function isAdmin(req, res, next) {
  try {
    // Check if user exists on request (set by authenticateJWT middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No user found',
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'ADMIN' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Admin access required',
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

module.exports = { isAdmin };
