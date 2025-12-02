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
 * @typedef {import('../../../../types/index.js').ChangePasswordInput} ChangePasswordInput
 * @typedef {import('../../../../types/index.js').AuthResponse} AuthResponse
 * @typedef {import('../../../../types/index.js').UserData} UserData
 */

/**
 * Register a new user (Portal)
 * @param {RegisterInput} userData - User registration data
 * @returns {Promise<AuthResponse>} Created user and token
 * @throws {Error} If user/username/phone already exists
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
      throw new Error(authMessages.usernameExists);
    }
    if (existingUser.phone === phone) {
      throw new Error(authMessages.phoneExists);
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
      role: userRoles.user,
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
 * @param {LoginInput} credentials - Login credentials (email, username, or phone)
 * @returns {Promise<AuthResponse>} User and token
 * @throws {Error} If credentials are invalid or account is deactivated
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
    throw new Error(authMessages.accountDeactivated);
  }

  // Check if user has password (not OAuth user)
  if (!user.passwordHash) {
    throw new Error(authMessages.useGoogleOrPhoneLogin);
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
 * @returns {Promise<UserData>} User profile
 * @throws {Error} If token is invalid, user not found, or account is deactivated
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
    throw new Error(authMessages.accountDeactivated);
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
 * Change password (Portal)
 * @param {string} userId - User ID
 * @param {ChangePasswordInput} passwordData - Old and new passwords
 * @returns {Promise<{message: string}>} Success message
 * @throws {Error} If user not found or old password is incorrect
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
    throw new Error(authMessages.incorrectPassword);
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash }
  });

  return {
    message: authMessages.passwordChanged
  };
};

/**
 * Request password reset (Portal)
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
 * Reset password with token (Portal)
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
