import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateToken, validateToken } from '../../../../library/jwtUtil.js';
import { authMessages } from '../../../../constant/messages.js';

const prisma = new PrismaClient();

/**
 * Register a new user (Portal)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user and token
 */
export const register = async (userData) => {
  const { email, password, firstName, lastName, username, phone } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        ...(username ? [{ username }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    }
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error(authMessages.userExists);
    }
    if (existingUser.username === username) {
      throw new Error('Username already taken');
    }
    if (existingUser.phone === phone) {
      throw new Error('Phone number already registered');
    }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      username,
      phone,
      role: 'USER',
      provider: 'LOCAL'
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
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role
    },
    token
  };
};

/**
 * Login user (Portal)
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} User and token
 */
export const login = async (credentials) => {
  const { identifier, password } = credentials;

  // Find user by email, username, or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
        { phone: identifier }
      ]
    }
  });

  if (!user) {
    throw new Error(authMessages.invalidCredentials);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  // Check if user has password (not OAuth user)
  if (!user.passwordHash) {
    throw new Error('Please use Google or Phone login for this account');
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
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified
    },
    token
  };
};

/**
 * Get user from token (Portal)
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

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    isVerified: user.isVerified,
    provider: user.provider,
    createdAt: user.createdAt
  };
};

/**
 * Change password
 * @param {string} userId - User ID
 * @param {Object} passwordData - Old and new passwords
 * @returns {Promise<Object>} Success message
 */
export const changePassword = async (userId, passwordData) => {
  const { oldPassword, newPassword } = passwordData;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error(authMessages.userNotFound);
  }

  // Verify old password
  const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash }
  });

  return {
    message: 'Password changed successfully'
  };
};
