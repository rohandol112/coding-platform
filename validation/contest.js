/**
 * Contest Validation Schemas
 */

const Joi = require('joi');
const { CONTEST_TYPE, CONTEST_STATUS, CONTEST_LIMITS, CONTEST_MESSAGES } = require('../constant/contest');

// Create Contest Schema
const createContestSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(CONTEST_LIMITS.TITLE_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': CONTEST_MESSAGES.TITLE_REQUIRED,
      'string.max': `Title must not exceed ${CONTEST_LIMITS.TITLE_MAX_LENGTH} characters`,
      'any.required': CONTEST_MESSAGES.TITLE_REQUIRED,
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
    .max(CONTEST_LIMITS.DESCRIPTION_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': CONTEST_MESSAGES.DESCRIPTION_REQUIRED,
      'string.max': `Description must not exceed ${CONTEST_LIMITS.DESCRIPTION_MAX_LENGTH} characters`,
      'any.required': CONTEST_MESSAGES.DESCRIPTION_REQUIRED,
    }),
  
  startTime: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Start time must be a valid date',
      'any.required': CONTEST_MESSAGES.START_TIME_REQUIRED,
    }),
  
  endTime: Joi.date()
    .iso()
    .greater(Joi.ref('startTime'))
    .required()
    .messages({
      'date.base': 'End time must be a valid date',
      'date.greater': CONTEST_MESSAGES.INVALID_TIME_RANGE,
      'any.required': CONTEST_MESSAGES.END_TIME_REQUIRED,
    }),
  
  duration: Joi.number()
    .integer()
    .min(CONTEST_LIMITS.MIN_DURATION)
    .max(CONTEST_LIMITS.MAX_DURATION)
    .required()
    .messages({
      'number.min': `Duration must be at least ${CONTEST_LIMITS.MIN_DURATION} minutes`,
      'number.max': `Duration must not exceed ${CONTEST_LIMITS.MAX_DURATION} minutes`,
      'any.required': CONTEST_MESSAGES.DURATION_REQUIRED,
    }),
  
  type: Joi.string()
    .valid(...Object.values(CONTEST_TYPE))
    .default(CONTEST_TYPE.PUBLIC)
    .messages({
      'any.only': CONTEST_MESSAGES.INVALID_TYPE,
    }),
  
  rules: Joi.string()
    .trim()
    .max(CONTEST_LIMITS.RULES_MAX_LENGTH)
    .allow('', null)
    .optional(),
  
  prizes: Joi.string()
    .trim()
    .max(CONTEST_LIMITS.PRIZES_MAX_LENGTH)
    .allow('', null)
    .optional(),
  
  maxParticipants: Joi.number()
    .integer()
    .min(1)
    .max(CONTEST_LIMITS.MAX_PARTICIPANTS)
    .optional()
    .allow(null)
    .messages({
      'number.min': 'Max participants must be at least 1',
      'number.max': `Max participants must not exceed ${CONTEST_LIMITS.MAX_PARTICIPANTS}`,
    }),
  
  registrationDeadline: Joi.date()
    .iso()
    .less(Joi.ref('startTime'))
    .optional()
    .allow(null)
    .messages({
      'date.base': 'Registration deadline must be a valid date',
      'date.less': CONTEST_MESSAGES.INVALID_REGISTRATION_DEADLINE,
    }),
  
  isPublic: Joi.boolean()
    .default(true),
});

// Update Contest Schema
const updateContestSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(CONTEST_LIMITS.TITLE_MAX_LENGTH)
    .messages({
      'string.max': `Title must not exceed ${CONTEST_LIMITS.TITLE_MAX_LENGTH} characters`,
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
    .max(CONTEST_LIMITS.DESCRIPTION_MAX_LENGTH)
    .messages({
      'string.max': `Description must not exceed ${CONTEST_LIMITS.DESCRIPTION_MAX_LENGTH} characters`,
    }),
  
  startTime: Joi.date().iso(),
  
  endTime: Joi.date()
    .iso()
    .when('startTime', {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref('startTime')),
    })
    .messages({
      'date.greater': CONTEST_MESSAGES.INVALID_TIME_RANGE,
    }),
  
  duration: Joi.number()
    .integer()
    .min(CONTEST_LIMITS.MIN_DURATION)
    .max(CONTEST_LIMITS.MAX_DURATION)
    .messages({
      'number.min': `Duration must be at least ${CONTEST_LIMITS.MIN_DURATION} minutes`,
      'number.max': `Duration must not exceed ${CONTEST_LIMITS.MAX_DURATION} minutes`,
    }),
  
  type: Joi.string()
    .valid(...Object.values(CONTEST_TYPE))
    .messages({
      'any.only': CONTEST_MESSAGES.INVALID_TYPE,
    }),
  
  rules: Joi.string()
    .trim()
    .max(CONTEST_LIMITS.RULES_MAX_LENGTH)
    .allow('', null),
  
  prizes: Joi.string()
    .trim()
    .max(CONTEST_LIMITS.PRIZES_MAX_LENGTH)
    .allow('', null),
  
  maxParticipants: Joi.number()
    .integer()
    .min(1)
    .max(CONTEST_LIMITS.MAX_PARTICIPANTS)
    .allow(null)
    .messages({
      'number.min': 'Max participants must be at least 1',
      'number.max': `Max participants must not exceed ${CONTEST_LIMITS.MAX_PARTICIPANTS}`,
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
    .valid(...Object.values(CONTEST_STATUS))
    .required()
    .messages({
      'any.only': CONTEST_MESSAGES.INVALID_STATUS,
      'any.required': 'Status is required',
    }),
});

// Contest Query Params Schema
const getContestsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid(...Object.values(CONTEST_STATUS)).optional(),
  type: Joi.string().valid(...Object.values(CONTEST_TYPE)).optional(),
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
