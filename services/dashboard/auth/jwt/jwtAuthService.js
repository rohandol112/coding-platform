import bcrypt from 'bcrypt';
import prisma from '../../../../library/prisma.js';
import { generateToken, validateToken } from '../../../../library/jwtUtil.js';
import { authMessages } from '../../../../constant/messages.js';
import { authProviders, userRoles } from '../../../../constant/authConstants.js';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user and token
 */
export const register = async (userData) => {
  const { email, password, firstName, lastName, role } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error(authMessages.userExists);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      role: role || userRoles.user,
      provider: authProviders.local
    }
  });

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    token
  };
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} User and token
 */
export const login = async (credentials) => {
  const { email, password } = credentials;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error(authMessages.invalidCredentials);
  }

  // Check if user has password (not OAuth user)
  if (!user.passwordHash) {
    throw new Error(authMessages.useGoogleLogin);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error(authMessages.invalidCredentials);
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    token
  };
};

/**
 * Get user from token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} User profile
 */
export const getUserFromToken = async (token) => {
  const decoded = validateToken(token);

  if (!decoded) {
    throw new Error(authMessages.invalidToken);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!user) {
    throw new Error(authMessages.userNotFound);
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
  };
};
