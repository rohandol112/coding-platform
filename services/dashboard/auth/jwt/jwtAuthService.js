import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../../../../library/prisma.js';
import { generateToken, validateToken } from '../../../../library/jwtUtil.js';
import { sendPasswordResetEmail } from '../../../../library/emailService.js';
import { authMessages } from '../../../../constant/messages.js';
import { authProviders, userRoles } from '../../../../constant/authConstants.js';

/**
 * @typedef {import('../../../../types/index.js').RegisterInput} RegisterInput
 * @typedef {import('../../../../types/index.js').LoginInput} LoginInput
 * @typedef {import('../../../../types/index.js').AuthResponse} AuthResponse
 * @typedef {import('../../../../types/index.js').UserData} UserData
 */

/**
 * Register a new user (Dashboard)
 * @param {RegisterInput} userData - User registration data
 * @returns {Promise<AuthResponse>} Created user and token
 * @throws {Error} If user already exists
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
 * Login user (Dashboard)
 * @param {LoginInput} credentials - Login credentials
 * @returns {Promise<AuthResponse>} User and token
 * @throws {Error} If credentials are invalid
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
 * Get user from token (Dashboard)
 * @param {string} token - JWT token
 * @returns {Promise<UserData>} User profile
 * @throws {Error} If token is invalid or user not found
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

/**
 * Request password reset (Dashboard)
 * @param {string} email - User email
 * @returns {Promise<{message: string}>} Success message
 * @throws {Error} If user not found or is OAuth account
 */
export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(authMessages.userNotFound);
  }
  if (user.provider !== authProviders.local) {
    throw new Error(authMessages.cannotResetOAuthPassword);
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = await bcrypt.hash(resetToken, 10);
  const resetTokenExpiry = new Date(Date.now() + 3600000);
  await prisma.user.update({ where: { id: user.id }, data: { resetToken: resetTokenHash, resetTokenExpiry } });
  await sendPasswordResetEmail(user.email, resetToken, user.firstName);
  return { message: authMessages.resetLinkSent };
};

/**
 * Reset password with token (Dashboard)
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @returns {Promise<{message: string}>} Success message
 * @throws {Error} If token is invalid or expired
 */
export const resetPassword = async (token, newPassword) => {
  const users = await prisma.user.findMany({ where: { resetToken: { not: null }, resetTokenExpiry: { gte: new Date() } } });
  let user = null;
  for (const u of users) {
    const isValid = await bcrypt.compare(token, u.resetToken);
    if (isValid) {
      user = u;
      break;
    }
  }
  if (!user) {
    throw new Error(authMessages.invalidResetToken);
  }
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newPasswordHash, resetToken: null, resetTokenExpiry: null } });
  return { message: authMessages.passwordReset };
};