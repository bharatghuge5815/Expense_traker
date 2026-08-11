const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');

/**
 * Authentication Middleware
 * Reads JWT from Authorization header (Bearer <token>), verifies it,
 * retrieves the user, and attaches `req.user` to request.
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication token missing.'
      });
    }

    const secret = process.env.JWT_SECRET || 'expense_tracker_secret_key_2026_super_secure_jwt';
    const decoded = jwt.verify(token, secret);

    // Fetch user from MySQL by ID decoded from token (never trust client provided user ID)
    const user = await userService.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User no longer exists.'
      });
    }

    // Attach authenticated user profile to req.user (without password_hash)
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.'
      });
    }

    next(error);
  }
};

module.exports = {
  authenticateToken
};
