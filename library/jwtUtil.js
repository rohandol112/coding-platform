import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate a JWT token
 * @param {Object} payload - User data to encode in token (email, role, id)
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production', { expiresIn: process.env.JWT_EXPIRATION || '24h' });
};

/**
 * Validate and decode a JWT token
 * @param {string} token - JWT token to validate
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const validateToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
  } catch (error) {
    return null;
  }
};

/**
 * Extract email from token
 * @param {string} token - JWT token
 * @returns {string|null} Email or null
 */
export const extractEmail = (token) => {
  const decoded = validateToken(token);
  return decoded ? decoded.email : null;
};

/**
 * Extract role from token
 * @param {string} token - JWT token
 * @returns {string|null} Role or null
 */
export const extractRole = (token) => {
  const decoded = validateToken(token);
  return decoded ? decoded.role : null;
};

/**
 * Extract user ID from token
 * @param {string} token - JWT token
 * @returns {string|null} User ID or null
 */
export const extractUserId = (token) => {
  const decoded = validateToken(token);
  return decoded ? decoded.id : null;
};
