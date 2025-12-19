/**
 * @fileoverview Joi validation schemas for portal endpoints
 * Uses message constants from portalMessages.js
 */

import Joi from 'joi';
import {
  problemMessages,
  contestMessages,
  submissionMessages,
  userProfileMessages,
} from '../constant/portalMessages.js';

// =====================
// Problem Validations
// =====================

/**
 * Schema for problem list query parameters
 */
const getProblemListSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': problemMessages.pageMinValue,
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.min': problemMessages.limitMinValue,
    'number.max': problemMessages.limitMaxValue,
  }),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').messages({
    'any.only': problemMessages.invalidDifficulty,
  }),
  tags: Joi.string(),
  search: Joi.string().max(100).messages({
    'string.max': problemMessages.searchMaxLength,
  }),
  sortBy: Joi.string().valid('createdAt', 'title', 'difficulty').default('createdAt').messages({
    'any.only': problemMessages.invalidSortBy,
  }),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': problemMessages.invalidSortOrder,
  }),
});

/**
 * Schema for problem slug parameter
 */
const getProblemBySlugSchema = Joi.object({
  slug: Joi.string().required().messages({
    'any.required': problemMessages.slugRequired,
  }),
});

// =====================
// Contest Validations
// =====================

/**
 * Schema for contest list query parameters
 */
const getContestListSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': problemMessages.pageMinValue,
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.min': problemMessages.limitMinValue,
    'number.max': problemMessages.limitMaxValue,
  }),
  status: Joi.string().valid('DRAFT', 'SCHEDULED', 'RUNNING', 'ENDED', 'CANCELLED').messages({
    'any.only': contestMessages.invalidStatus,
  }),
  type: Joi.string().valid('PUBLIC', 'PRIVATE', 'COLLEGE').messages({
    'any.only': contestMessages.invalidType,
  }),
  search: Joi.string().max(100).messages({
    'string.max': problemMessages.searchMaxLength,
  }),
  sortBy: Joi.string().valid('startTime', 'endTime', 'createdAt', 'title').default('startTime').messages({
    'any.only': problemMessages.invalidSortBy,
  }),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': problemMessages.invalidSortOrder,
  }),
});

/**
 * Schema for contest slug parameter
 */
const getContestBySlugSchema = Joi.object({
  slug: Joi.string().required().messages({
    'any.required': contestMessages.slugRequired,
  }),
});

/**
 * Schema for contest ID parameter
 */
const contestIdSchema = Joi.object({
  contestId: Joi.string().uuid().required().messages({
    'string.guid': contestMessages.contestIdInvalid,
    'any.required': contestMessages.contestIdRequired,
  }),
});

/**
 * Schema for leaderboard query parameters
 */
const leaderboardQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': problemMessages.pageMinValue,
  }),
  limit: Joi.number().integer().min(1).max(200).default(100).messages({
    'number.min': problemMessages.limitMinValue,
    'number.max': contestMessages.leaderboardLimitMax,
  }),
});

// =====================
// Submission Validations
// =====================

/**
 * Schema for creating a submission
 */
const createSubmissionSchema = Joi.object({
  problemId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': submissionMessages.problemIdInvalid,
      'any.required': submissionMessages.problemIdRequired,
    }),
  language: Joi.string()
    .valid('javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust', 'typescript', 'kotlin', 'swift', 'ruby', 'php')
    .required()
    .messages({
      'any.only': submissionMessages.languageInvalid,
      'any.required': submissionMessages.languageRequired,
    }),
  code: Joi.string()
    .min(1)
    .max(65536)
    .required()
    .messages({
      'string.min': submissionMessages.codeEmpty,
      'string.max': submissionMessages.codeMaxSize,
      'any.required': submissionMessages.codeRequired,
    }),
  contestId: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      'string.guid': contestMessages.contestIdInvalid,
    }),
});

/**
 * Schema for getting submission by ID
 */
const getSubmissionByIdSchema = Joi.object({
  submissionId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': submissionMessages.submissionIdInvalid,
      'any.required': submissionMessages.submissionIdRequired,
    }),
});

/**
 * Schema for submission list query parameters
 */
const getSubmissionListSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': problemMessages.pageMinValue,
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.min': problemMessages.limitMinValue,
    'number.max': problemMessages.limitMaxValue,
  }),
  problemId: Joi.string().uuid().messages({
    'string.guid': submissionMessages.problemIdInvalid,
  }),
  contestId: Joi.string().uuid().messages({
    'string.guid': contestMessages.contestIdInvalid,
  }),
  status: Joi.string().valid(
    'QUEUED', 'RUNNING', 'COMPILE_ERROR', 'WRONG_ANSWER',
    'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'MEMORY_LIMIT_EXCEEDED',
    'ACCEPTED', 'PARTIAL', 'FAILED'
  ).messages({
    'any.only': submissionMessages.invalidStatus,
  }),
  language: Joi.string().valid('javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust', 'typescript', 'kotlin', 'swift', 'ruby', 'php').messages({
    'any.only': submissionMessages.languageInvalid,
  }),
  sortBy: Joi.string().valid('createdAt', 'status', 'time', 'memory', 'score').default('createdAt').messages({
    'any.only': problemMessages.invalidSortBy,
  }),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': problemMessages.invalidSortOrder,
  }),
});

/**
 * Schema for running code
 */
const runCodeSchema = Joi.object({
  language: Joi.string()
    .valid('javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust', 'typescript', 'kotlin', 'swift', 'ruby', 'php')
    .required()
    .messages({
      'any.only': submissionMessages.languageInvalid,
      'any.required': submissionMessages.languageRequired,
    }),
  code: Joi.string()
    .min(1)
    .max(65536)
    .required()
    .messages({
      'string.min': submissionMessages.codeEmpty,
      'string.max': submissionMessages.codeMaxSize,
      'any.required': submissionMessages.codeRequired,
    }),
  stdin: Joi.string()
    .allow('')
    .max(10240)
    .default('')
    .messages({
      'string.max': submissionMessages.stdinMaxSize,
    }),
});

// =====================
// User Validations
// =====================

/**
 * Schema for getting user by username
 */
const getUserByUsernameSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.min': userProfileMessages.usernameMinLength,
      'string.max': userProfileMessages.usernameMaxLength,
      'any.required': userProfileMessages.usernameRequired,
    }),
});

/**
 * Schema for global leaderboard query parameters
 */
const globalLeaderboardSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.min': problemMessages.pageMinValue,
  }),
  limit: Joi.number().integer().min(1).max(100).default(50).messages({
    'number.min': problemMessages.limitMinValue,
    'number.max': problemMessages.limitMaxValue,
  }),
  timeframe: Joi.string().valid('ALL_TIME', 'MONTHLY', 'WEEKLY').default('ALL_TIME').messages({
    'any.only': userProfileMessages.invalidTimeframe,
  }),
});

/**
 * Schema for updating user profile
 */
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional().messages({
    'string.min': userProfileMessages.firstNameEmpty,
    'string.max': userProfileMessages.firstNameMaxLength,
  }),
  lastName: Joi.string().min(1).max(50).optional().messages({
    'string.min': userProfileMessages.lastNameEmpty,
    'string.max': userProfileMessages.lastNameMaxLength,
  }),
  avatar: Joi.string().uri().optional().messages({
    'string.uri': userProfileMessages.avatarInvalidUrl,
  }),
});

/**
 * Schema for activity calendar query parameters
 */
const activityCalendarSchema = Joi.object({
  months: Joi.number().integer().min(1).max(24).default(12).messages({
    'number.min': userProfileMessages.monthsMinValue,
    'number.max': userProfileMessages.monthsMaxValue,
  }),
});

export {
  // Problem
  getProblemListSchema,
  getProblemBySlugSchema,
  // Contest
  getContestListSchema,
  getContestBySlugSchema,
  contestIdSchema,
  leaderboardQuerySchema,
  // Submission
  createSubmissionSchema,
  getSubmissionByIdSchema,
  getSubmissionListSchema,
  runCodeSchema,
  // User
  getUserByUsernameSchema,
  globalLeaderboardSchema,
  updateProfileSchema,
  activityCalendarSchema,
};

export default {
  // Problem
  getProblemListSchema,
  getProblemBySlugSchema,
  // Contest
  getContestListSchema,
  getContestBySlugSchema,
  contestIdSchema,
  leaderboardQuerySchema,
  // Submission
  createSubmissionSchema,
  getSubmissionByIdSchema,
  getSubmissionListSchema,
  runCodeSchema,
  // User
  getUserByUsernameSchema,
  globalLeaderboardSchema,
  updateProfileSchema,
  activityCalendarSchema,
};
