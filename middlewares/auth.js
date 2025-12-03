/**
 * @fileoverview Authentication middleware
 */

import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided',
      });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - Invalid token',
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

export { authenticateJWT };
