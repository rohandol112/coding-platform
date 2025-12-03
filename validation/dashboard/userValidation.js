import Joi from 'joi';

export const getUsersSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR'),
  isActive: Joi.string().valid('true', 'false'),
  search: Joi.string().min(1).max(100),
  sortBy: Joi.string().valid('createdAt', 'email', 'username', 'firstName', 'lastName', 'lastLoginAt'),
  sortOrder: Joi.string().valid('asc', 'desc')
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  username: Joi.string().min(3).max(30).alphanum(),
  isVerified: Joi.boolean()
}).min(1);

export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('USER', 'ADMIN', 'MODERATOR').required()
});
