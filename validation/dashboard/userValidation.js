import Joi from 'joi';
import { userMessages } from '../../constant/userMessages.js';

export const getUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).messages({
    'number.min': userMessages.pageMinValue
  }),
  limit: Joi.number().integer().min(1).max(100).messages({
    'number.min': userMessages.limitMinValue,
    'number.max': userMessages.limitMaxValue
  }),
  role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR').messages({
    'any.only': userMessages.invalidRole
  }),
  isActive: Joi.string().valid('true', 'false'),
  search: Joi.string().min(1).max(100).messages({
    'string.max': userMessages.searchMaxLength
  }),
  sortBy: Joi.string().valid('createdAt', 'email', 'username', 'firstName', 'lastName', 'lastLoginAt').messages({
    'any.only': userMessages.invalidSortBy
  }),
  sortOrder: Joi.string().valid('asc', 'desc').messages({
    'any.only': userMessages.invalidSortOrder
  })
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).messages({
    'string.min': userMessages.firstNameMinLength,
    'string.max': userMessages.firstNameMaxLength
  }),
  lastName: Joi.string().min(2).max(50).messages({
    'string.min': userMessages.lastNameMinLength,
    'string.max': userMessages.lastNameMaxLength
  }),
  username: Joi.string().min(3).max(30).alphanum().messages({
    'string.min': userMessages.usernameMinLength,
    'string.max': userMessages.usernameMaxLength,
    'string.alphanum': userMessages.usernameAlphanumeric
  }),
  isVerified: Joi.boolean()
}).min(1);

export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR').required().messages({
    'any.only': userMessages.invalidRole
  })
});
