import Joi from 'joi';
import { authMessages } from '../constant/messages.js';

/**
 * Registration validation schema for Portal
 * Supports email, username, and phone registration
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({ 'string.email': authMessages.emailInvalid, 'any.required': authMessages.emailRequired, 'string.empty': authMessages.emailRequired }),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({ 'string.min': authMessages.passwordMinLength, 'string.max': 'Password must not exceed 128 characters', 'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number', 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match', 'any.required': 'Please confirm your password', 'string.empty': 'Please confirm your password' }),
  firstName: Joi.string().min(2).max(50).required().trim().messages({ 'string.min': authMessages.firstNameMinLength, 'string.max': 'First name must not exceed 50 characters', 'any.required': authMessages.firstNameRequired, 'string.empty': authMessages.firstNameRequired }),
  lastName: Joi.string().min(2).max(50).required().trim().messages({ 'string.min': authMessages.lastNameMinLength, 'string.max': 'Last name must not exceed 50 characters', 'any.required': authMessages.lastNameRequired, 'string.empty': authMessages.lastNameRequired }),
  username: Joi.string().min(3).max(30).alphanum().lowercase().trim().optional().messages({ 'string.min': 'Username must be at least 3 characters long', 'string.max': 'Username must not exceed 30 characters', 'string.alphanum': 'Username must contain only letters and numbers' }),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({ 'string.pattern.base': 'Please provide a valid phone number in E.164 format' })
});

/**
 * Login validation schema for Portal
 * Supports login with email, username, or phone
 */
export const loginSchema = Joi.object({
  identifier: Joi.string().required().trim().messages({ 'any.required': 'Email, username, or phone is required', 'string.empty': 'Email, username, or phone is required' }),
  password: Joi.string().required().messages({ 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired })
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({ 'any.required': 'Current password is required', 'string.empty': 'Current password is required' }),
  newPassword: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().invalid(Joi.ref('oldPassword')).messages({ 'string.min': authMessages.passwordMinLength, 'string.max': 'Password must not exceed 128 characters', 'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number', 'any.required': 'New password is required', 'string.empty': 'New password is required', 'any.invalid': 'New password must be different from current password' }),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({ 'any.only': 'Passwords do not match', 'any.required': 'Please confirm your new password', 'string.empty': 'Please confirm your new password' })
});

/**
 * Email validation schema
 */
export const emailSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({ 'string.email': authMessages.emailInvalid, 'any.required': authMessages.emailRequired, 'string.empty': authMessages.emailRequired })
});

/**
 * Password reset validation schema
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({ 'any.required': 'Reset token is required', 'string.empty': 'Reset token is required' }),
  newPassword: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({ 'string.min': authMessages.passwordMinLength, 'string.max': 'Password must not exceed 128 characters', 'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number', 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({ 'any.only': 'Passwords do not match', 'any.required': 'Please confirm your password', 'string.empty': 'Please confirm your password' })
});
