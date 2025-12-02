import Joi from 'joi';
import { authMessages } from '../constant/messages.js';

/**
 * @typedef {import('../types/index.js').RegisterInput} RegisterInput
 * @typedef {import('../types/index.js').LoginInput} LoginInput
 * @typedef {import('../types/index.js').ChangePasswordInput} ChangePasswordInput
 * @typedef {import('../types/index.js').ResetPasswordInput} ResetPasswordInput
 */

/**
 * Registration validation schema for Portal
 * Supports email, username, and phone registration
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({ 'string.email': authMessages.emailInvalid, 'any.required': authMessages.emailRequired, 'string.empty': authMessages.emailRequired }),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({ 'string.min': authMessages.passwordMinLength, 'string.max': authMessages.passwordMaxLength, 'string.pattern.base': authMessages.passwordPattern, 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': authMessages.passwordsDoNotMatch, 'any.required': authMessages.confirmPasswordRequired, 'string.empty': authMessages.confirmPasswordRequired }),
  firstName: Joi.string().min(2).max(50).required().trim().messages({ 'string.min': authMessages.firstNameMinLength, 'string.max': authMessages.firstNameMaxLength, 'any.required': authMessages.firstNameRequired, 'string.empty': authMessages.firstNameRequired }),
  lastName: Joi.string().min(2).max(50).required().trim().messages({ 'string.min': authMessages.lastNameMinLength, 'string.max': authMessages.lastNameMaxLength, 'any.required': authMessages.lastNameRequired, 'string.empty': authMessages.lastNameRequired }),
  username: Joi.string().min(3).max(30).alphanum().lowercase().trim().optional().messages({ 'string.min': authMessages.usernameMinLength, 'string.max': authMessages.usernameMaxLength, 'string.alphanum': authMessages.usernameAlphanum }),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({ 'string.pattern.base': authMessages.phoneInvalidE164 })
});

/**
 * Login validation schema for Portal
 * Supports login with email, username, or phone
 */
export const loginSchema = Joi.object({
  identifier: Joi.string().required().trim().messages({ 'any.required': authMessages.identifierRequired, 'string.empty': authMessages.identifierRequired }),
  password: Joi.string().required().messages({ 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired })
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({ 'any.required': authMessages.currentPasswordRequired, 'string.empty': authMessages.currentPasswordRequired }),
  newPassword: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().invalid(Joi.ref('oldPassword')).messages({ 'string.min': authMessages.passwordMinLength, 'string.max': authMessages.passwordMaxLength, 'string.pattern.base': authMessages.passwordPattern, 'any.required': authMessages.newPasswordRequired, 'string.empty': authMessages.newPasswordRequired, 'any.invalid': authMessages.newPasswordDifferent }),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({ 'any.only': authMessages.passwordsDoNotMatch, 'any.required': authMessages.confirmNewPasswordRequired, 'string.empty': authMessages.confirmNewPasswordRequired })
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
  token: Joi.string().required().messages({ 'any.required': authMessages.tokenRequired, 'string.empty': authMessages.tokenRequired }),
  newPassword: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({ 'string.min': authMessages.passwordMinLength, 'string.max': authMessages.passwordMaxLength, 'string.pattern.base': authMessages.passwordPattern, 'any.required': authMessages.passwordRequired, 'string.empty': authMessages.passwordRequired }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({ 'any.only': authMessages.passwordsDoNotMatch, 'any.required': authMessages.confirmPasswordRequired, 'string.empty': authMessages.confirmPasswordRequired })
});
