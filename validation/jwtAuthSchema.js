import Joi from 'joi';
import { authMessages } from '../constant/messages.js';

/**
 * @typedef {import('../types/index.js').RegisterInput} RegisterInput
 * @typedef {import('../types/index.js').LoginInput} LoginInput
 * @typedef {import('../types/index.js').ResetPasswordInput} ResetPasswordInput
 */

/**
 * Registration validation schema for Dashboard (Admin)
 * Includes role assignment capability
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({ 'string.email': authMessages.emailInvalid, 'any.required': authMessages.emailRequired, 'string.empty': authMessages.emailRequired }),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({ 'string.min': authMessages.passwordMinLength, 'string.max': authMessages.passwordMaxLength, 'string.pattern.base': authMessages.passwordPattern, 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired }),
  firstName: Joi.string().min(2).max(50).required().trim().messages({ 'string.min': authMessages.firstNameMinLength, 'string.max': authMessages.firstNameMaxLength, 'any.required': authMessages.firstNameRequired, 'string.empty': authMessages.firstNameRequired }),
  lastName: Joi.string().min(2).max(50).required().trim().messages({ 'string.min': authMessages.lastNameMinLength, 'string.max': authMessages.lastNameMaxLength, 'any.required': authMessages.lastNameRequired, 'string.empty': authMessages.lastNameRequired }),
  role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR').default('USER').messages({ 'any.only': authMessages.roleInvalid })
});

/**
 * Login validation schema for Dashboard (Admin)
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({ 'string.email': authMessages.emailInvalid, 'any.required': authMessages.emailRequired, 'string.empty': authMessages.emailRequired }),
  password: Joi.string().required().messages({ 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired })
});

/**
 * Email validation schema for Dashboard
 */
export const emailSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({ 'string.email': authMessages.emailInvalid, 'any.required': authMessages.emailRequired, 'string.empty': authMessages.emailRequired })
});

/**
 * Password reset validation schema for Dashboard
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({ 'any.required': authMessages.tokenRequired, 'string.empty': authMessages.tokenRequired }),
  newPassword: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({ 'string.min': authMessages.passwordMinLength, 'string.max': authMessages.passwordMaxLength, 'string.pattern.base': authMessages.passwordPattern, 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({ 'any.only': authMessages.passwordsDoNotMatch, 'any.required': authMessages.confirmPasswordRequired, 'string.empty': authMessages.confirmPasswordRequired })
});
