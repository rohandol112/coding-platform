import Joi from 'joi';
import { authMessages } from '../constant/messages.js';

/**
 * Registration validation schema for Dashboard (Admin)
 * Includes role assignment capability
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({ 'string.email': authMessages.emailInvalid, 'any.required': authMessages.emailRequired, 'string.empty': authMessages.emailRequired }),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({ 'string.min': authMessages.passwordMinLength, 'string.max': 'Password must not exceed 128 characters', 'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number', 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired }),
  firstName: Joi.string().min(2).max(50).required().trim().messages({ 'string.min': authMessages.firstNameMinLength, 'string.max': 'First name must not exceed 50 characters', 'any.required': authMessages.firstNameRequired, 'string.empty': authMessages.firstNameRequired }),
  lastName: Joi.string().min(2).max(50).required().trim().messages({ 'string.min': authMessages.lastNameMinLength, 'string.max': 'Last name must not exceed 50 characters', 'any.required': authMessages.lastNameRequired, 'string.empty': authMessages.lastNameRequired }),
  role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR').default('USER').messages({ 'any.only': 'Role must be one of: USER, ADMIN, MODERATOR' })
});

/**
 * Login validation schema for Dashboard (Admin)
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({ 'string.email': authMessages.emailInvalid, 'any.required': authMessages.emailRequired, 'string.empty': authMessages.emailRequired }),
  password: Joi.string().required().messages({ 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired })
});
