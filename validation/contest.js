/**
 * Contest Validation Schemas
 */

const Joi = require('joi');
const { contestType, contestStatus, contestLimits, contestMessages } = require('../constant/contest');

// Create Contest Schema
const createContestSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(contestLimits.titleMaxLength)
    .required()
    .messages({
      'string.empty': contestMessages.titleRequired,
      'string.max': `Title must not exceed ${contestLimits.titleMaxLength} characters`,
      'any.required': contestMessages.titleRequired,
    }),
  
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(200)
    .optional()
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  
  description: Joi.string()
    .trim()
    .max(contestLimits.descriptionMaxLength)
    .required()
    .messages({
      'string.empty': contestMessages.descriptionRequired,
      'string.max': `Description must not exceed ${contestLimits.descriptionMaxLength} characters`,
      'any.required': contestMessages.descriptionRequired,
    }),
  
  startTime: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Start time must be a valid date',
      'any.required': contestMessages.startTimeRequired,
    }),
  
  endTime: Joi.date()
    .iso()
    .greater(Joi.ref('startTime'))
    .required()
    .messages({
      'date.base': 'End time must be a valid date',
      'date.greater': contestMessages.invalidTimeRange,
      'any.required': contestMessages.endTimeRequired,
    }),
  
  duration: Joi.number()
    .integer()
    .min(contestLimits.minDuration)
    .max(contestLimits.maxDuration)
    .required()
    .messages({
      'number.min': `Duration must be at least ${contestLimits.minDuration} minutes`,
      'number.max': `Duration must not exceed ${contestLimits.maxDuration} minutes`,
      'any.required': contestMessages.durationRequired,
    }),
  
  type: Joi.string()
    .valid(...Object.values(contestType))
    .default(contestType.public)
    .messages({
      'any.only': contestMessages.invalidType,
    }),
  
  rules: Joi.string()
    .trim()
    .max(contestLimits.rulesMaxLength)
    .allow('', null)
    .optional(),
  
  prizes: Joi.string()
    .trim()
    .max(contestLimits.prizesMaxLength)
    .allow('', null)
    .optional(),
  
  maxParticipants: Joi.number()
    .integer()
    .min(1)
    .max(contestLimits.maxParticipants)
    .optional()
    .allow(null)
    .messages({
      'number.min': 'Max participants must be at least 1',
      'number.max': `Max participants must not exceed ${contestLimits.maxParticipants}`,
    }),
  
  registrationDeadline: Joi.date()
    .iso()
    .less(Joi.ref('startTime'))
    .optional()
    .allow(null)
    .messages({
      'date.base': 'Registration deadline must be a valid date',
      'date.less': contestMessages.invalidRegistrationDeadline,
    }),
  
  isPublic: Joi.boolean()
    .default(true),
});

// Update Contest Schema
const updateContestSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(contestLimits.titleMaxLength)
    .messages({
      'string.max': `Title must not exceed ${contestLimits.titleMaxLength} characters`,
    }),
  
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(200)
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  
  description: Joi.string()
    .trim()
    .max(contestLimits.descriptionMaxLength)
    .messages({
      'string.max': `Description must not exceed ${contestLimits.descriptionMaxLength} characters`,
    }),
  
  startTime: Joi.date().iso(),
  
  endTime: Joi.date()
    .iso()
    .when('startTime', {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref('startTime')),
    })
    .messages({
      'date.greater': contestMessages.invalidTimeRange,
    }),
  
  duration: Joi.number()
    .integer()
    .min(contestLimits.minDuration)
    .max(contestLimits.maxDuration)
    .messages({
      'number.min': `Duration must be at least ${contestLimits.minDuration} minutes`,
      'number.max': `Duration must not exceed ${contestLimits.maxDuration} minutes`,
    }),
  
  type: Joi.string()
    .valid(...Object.values(contestType))
    .messages({
      'any.only': contestMessages.invalidType,
    }),
  
  rules: Joi.string()
    .trim()
    .max(contestLimits.rulesMaxLength)
    .allow('', null),
  
  prizes: Joi.string()
    .trim()
    .max(contestLimits.prizesMaxLength)
    .allow('', null),
  
  maxParticipants: Joi.number()
    .integer()
    .min(1)
    .max(contestLimits.maxParticipants)
    .allow(null)
    .messages({
      'number.min': 'Max participants must be at least 1',
      'number.max': `Max participants must not exceed ${contestLimits.maxParticipants}`,
    }),
  
  registrationDeadline: Joi.date()
    .iso()
    .allow(null),
  
  isPublic: Joi.boolean(),
}).min(1);

// Add Problem to Contest Schema
const addProblemToContestSchema = Joi.object({
  problemId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.empty': 'Problem ID is required',
      'string.guid': 'Problem ID must be a valid UUID',
      'any.required': 'Problem ID is required',
    }),
  
  points: Joi.number()
    .integer()
    .min(0)
    .max(1000)
    .default(100)
    .messages({
      'number.min': 'Points must be at least 0',
      'number.max': 'Points must not exceed 1000',
    }),
  
  bonusPoints: Joi.number()
    .integer()
    .min(0)
    .max(500)
    .default(0)
    .messages({
      'number.min': 'Bonus points must be at least 0',
      'number.max': 'Bonus points must not exceed 500',
    }),
  
  orderIndex: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Order index must be at least 0',
    }),
});

// Update Contest Status Schema
const updateContestStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(contestStatus))
    .required()
    .messages({
      'any.only': contestMessages.invalidStatus,
      'any.required': 'Status is required',
    }),
});

// Contest Query Params Schema
const getContestsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid(...Object.values(contestStatus)).optional(),
  type: Joi.string().valid(...Object.values(contestType)).optional(),
  search: Joi.string().trim().max(100).optional(),
  sortBy: Joi.string().valid('startTime', 'endTime', 'createdAt', 'title').default('startTime'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createContestSchema,
  updateContestSchema,
  addProblemToContestSchema,
  updateContestStatusSchema,
  getContestsSchema,
};
