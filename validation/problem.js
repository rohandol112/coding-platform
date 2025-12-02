/**
 * Problem Validation Schemas
 */

const Joi = require('joi');
const { PROBLEM_DIFFICULTY, PROBLEM_LIMITS, TEST_CASE_LIMITS, PROBLEM_MESSAGES } = require('../constant/problem');

// Create Problem Schema
const createProblemSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.TITLE_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': PROBLEM_MESSAGES.TITLE_REQUIRED,
      'string.max': `Title must not exceed ${PROBLEM_LIMITS.TITLE_MAX_LENGTH} characters`,
      'any.required': PROBLEM_MESSAGES.TITLE_REQUIRED,
    }),
  
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(PROBLEM_LIMITS.SLUG_MAX_LENGTH)
    .optional()
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  
  difficulty: Joi.string()
    .valid(...Object.values(PROBLEM_DIFFICULTY))
    .required()
    .messages({
      'any.only': PROBLEM_MESSAGES.INVALID_DIFFICULTY,
      'any.required': PROBLEM_MESSAGES.DIFFICULTY_REQUIRED,
    }),
  
  tags: Joi.array()
    .items(
      Joi.string()
        .trim()
        .max(PROBLEM_LIMITS.TAG_MAX_LENGTH)
        .pattern(/^[a-zA-Z0-9-\s]+$/)
    )
    .max(PROBLEM_LIMITS.MAX_TAGS)
    .default([])
    .messages({
      'array.max': PROBLEM_MESSAGES.TOO_MANY_TAGS,
      'string.pattern.base': PROBLEM_MESSAGES.INVALID_TAG,
    }),
  
  statement: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.STATEMENT_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': PROBLEM_MESSAGES.STATEMENT_REQUIRED,
      'string.max': `Statement must not exceed ${PROBLEM_LIMITS.STATEMENT_MAX_LENGTH} characters`,
      'any.required': PROBLEM_MESSAGES.STATEMENT_REQUIRED,
    }),
  
  inputFormat: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.INPUT_FORMAT_MAX_LENGTH)
    .allow('', null)
    .optional(),
  
  outputFormat: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.OUTPUT_FORMAT_MAX_LENGTH)
    .allow('', null)
    .optional(),
  
  constraints: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.CONSTRAINTS_MAX_LENGTH)
    .allow('', null)
    .optional(),
  
  examples: Joi.array()
    .items(
      Joi.object({
        input: Joi.string().required(),
        output: Joi.string().required(),
        explanation: Joi.string().allow('', null).optional(),
      })
    )
    .max(10)
    .default([])
    .optional(),
  
  hints: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.HINTS_MAX_LENGTH)
    .allow('', null)
    .optional(),
  
  solutionApproach: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.SOLUTION_APPROACH_MAX_LENGTH)
    .allow('', null)
    .optional(),
  
  timeLimit: Joi.number()
    .integer()
    .min(PROBLEM_LIMITS.MIN_TIME_LIMIT)
    .max(PROBLEM_LIMITS.MAX_TIME_LIMIT)
    .default(PROBLEM_LIMITS.DEFAULT_TIME_LIMIT)
    .messages({
      'number.min': `Time limit must be at least ${PROBLEM_LIMITS.MIN_TIME_LIMIT}ms`,
      'number.max': `Time limit must not exceed ${PROBLEM_LIMITS.MAX_TIME_LIMIT}ms`,
    }),
  
  memoryLimit: Joi.number()
    .integer()
    .min(PROBLEM_LIMITS.MIN_MEMORY_LIMIT)
    .max(PROBLEM_LIMITS.MAX_MEMORY_LIMIT)
    .default(PROBLEM_LIMITS.DEFAULT_MEMORY_LIMIT)
    .messages({
      'number.min': `Memory limit must be at least ${PROBLEM_LIMITS.MIN_MEMORY_LIMIT}KB`,
      'number.max': `Memory limit must not exceed ${PROBLEM_LIMITS.MAX_MEMORY_LIMIT}KB`,
    }),
  
  sourceLimit: Joi.number()
    .integer()
    .min(PROBLEM_LIMITS.MIN_SOURCE_LIMIT)
    .max(PROBLEM_LIMITS.MAX_SOURCE_LIMIT)
    .default(PROBLEM_LIMITS.DEFAULT_SOURCE_LIMIT)
    .messages({
      'number.min': `Source limit must be at least ${PROBLEM_LIMITS.MIN_SOURCE_LIMIT} bytes`,
      'number.max': `Source limit must not exceed ${PROBLEM_LIMITS.MAX_SOURCE_LIMIT} bytes`,
    }),
  
  isPublic: Joi.boolean().default(false),
});

// Update Problem Schema
const updateProblemSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.TITLE_MAX_LENGTH)
    .messages({
      'string.max': `Title must not exceed ${PROBLEM_LIMITS.TITLE_MAX_LENGTH} characters`,
    }),
  
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(PROBLEM_LIMITS.SLUG_MAX_LENGTH)
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  
  difficulty: Joi.string()
    .valid(...Object.values(PROBLEM_DIFFICULTY))
    .messages({
      'any.only': PROBLEM_MESSAGES.INVALID_DIFFICULTY,
    }),
  
  tags: Joi.array()
    .items(
      Joi.string()
        .trim()
        .max(PROBLEM_LIMITS.TAG_MAX_LENGTH)
        .pattern(/^[a-zA-Z0-9-\s]+$/)
    )
    .max(PROBLEM_LIMITS.MAX_TAGS)
    .messages({
      'array.max': PROBLEM_MESSAGES.TOO_MANY_TAGS,
      'string.pattern.base': PROBLEM_MESSAGES.INVALID_TAG,
    }),
  
  statement: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.STATEMENT_MAX_LENGTH)
    .messages({
      'string.max': `Statement must not exceed ${PROBLEM_LIMITS.STATEMENT_MAX_LENGTH} characters`,
    }),
  
  inputFormat: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.INPUT_FORMAT_MAX_LENGTH)
    .allow('', null),
  
  outputFormat: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.OUTPUT_FORMAT_MAX_LENGTH)
    .allow('', null),
  
  constraints: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.CONSTRAINTS_MAX_LENGTH)
    .allow('', null),
  
  examples: Joi.array()
    .items(
      Joi.object({
        input: Joi.string().required(),
        output: Joi.string().required(),
        explanation: Joi.string().allow('', null).optional(),
      })
    )
    .max(10),
  
  hints: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.HINTS_MAX_LENGTH)
    .allow('', null),
  
  solutionApproach: Joi.string()
    .trim()
    .max(PROBLEM_LIMITS.SOLUTION_APPROACH_MAX_LENGTH)
    .allow('', null),
  
  timeLimit: Joi.number()
    .integer()
    .min(PROBLEM_LIMITS.MIN_TIME_LIMIT)
    .max(PROBLEM_LIMITS.MAX_TIME_LIMIT)
    .messages({
      'number.min': `Time limit must be at least ${PROBLEM_LIMITS.MIN_TIME_LIMIT}ms`,
      'number.max': `Time limit must not exceed ${PROBLEM_LIMITS.MAX_TIME_LIMIT}ms`,
    }),
  
  memoryLimit: Joi.number()
    .integer()
    .min(PROBLEM_LIMITS.MIN_MEMORY_LIMIT)
    .max(PROBLEM_LIMITS.MAX_MEMORY_LIMIT)
    .messages({
      'number.min': `Memory limit must be at least ${PROBLEM_LIMITS.MIN_MEMORY_LIMIT}KB`,
      'number.max': `Memory limit must not exceed ${PROBLEM_LIMITS.MAX_MEMORY_LIMIT}KB`,
    }),
  
  sourceLimit: Joi.number()
    .integer()
    .min(PROBLEM_LIMITS.MIN_SOURCE_LIMIT)
    .max(PROBLEM_LIMITS.MAX_SOURCE_LIMIT)
    .messages({
      'number.min': `Source limit must be at least ${PROBLEM_LIMITS.MIN_SOURCE_LIMIT} bytes`,
      'number.max': `Source limit must not exceed ${PROBLEM_LIMITS.MAX_SOURCE_LIMIT} bytes`,
    }),
  
  isPublic: Joi.boolean(),
}).min(1);

// Create Test Case Schema
const createTestCaseSchema = Joi.object({
  input: Joi.string()
    .max(TEST_CASE_LIMITS.INPUT_MAX_SIZE)
    .required()
    .messages({
      'string.empty': 'Test case input is required',
      'string.max': `Input must not exceed ${TEST_CASE_LIMITS.INPUT_MAX_SIZE} bytes`,
      'any.required': 'Test case input is required',
    }),
  
  expectedOutput: Joi.string()
    .max(TEST_CASE_LIMITS.OUTPUT_MAX_SIZE)
    .required()
    .messages({
      'string.empty': 'Expected output is required',
      'string.max': `Output must not exceed ${TEST_CASE_LIMITS.OUTPUT_MAX_SIZE} bytes`,
      'any.required': 'Expected output is required',
    }),
  
  isHidden: Joi.boolean().default(true),
  
  points: Joi.number()
    .integer()
    .min(TEST_CASE_LIMITS.MIN_POINTS)
    .max(TEST_CASE_LIMITS.MAX_POINTS)
    .default(TEST_CASE_LIMITS.DEFAULT_POINTS)
    .messages({
      'number.min': `Points must be at least ${TEST_CASE_LIMITS.MIN_POINTS}`,
      'number.max': `Points must not exceed ${TEST_CASE_LIMITS.MAX_POINTS}`,
    }),
  
  explanation: Joi.string()
    .trim()
    .max(TEST_CASE_LIMITS.EXPLANATION_MAX_LENGTH)
    .allow('', null)
    .optional(),
  
  orderIndex: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Order index must be at least 0',
    }),
});

// Update Test Case Schema
const updateTestCaseSchema = Joi.object({
  input: Joi.string()
    .max(TEST_CASE_LIMITS.INPUT_MAX_SIZE)
    .messages({
      'string.max': `Input must not exceed ${TEST_CASE_LIMITS.INPUT_MAX_SIZE} bytes`,
    }),
  
  expectedOutput: Joi.string()
    .max(TEST_CASE_LIMITS.OUTPUT_MAX_SIZE)
    .messages({
      'string.max': `Output must not exceed ${TEST_CASE_LIMITS.OUTPUT_MAX_SIZE} bytes`,
    }),
  
  isHidden: Joi.boolean(),
  
  points: Joi.number()
    .integer()
    .min(TEST_CASE_LIMITS.MIN_POINTS)
    .max(TEST_CASE_LIMITS.MAX_POINTS)
    .messages({
      'number.min': `Points must be at least ${TEST_CASE_LIMITS.MIN_POINTS}`,
      'number.max': `Points must not exceed ${TEST_CASE_LIMITS.MAX_POINTS}`,
    }),
  
  explanation: Joi.string()
    .trim()
    .max(TEST_CASE_LIMITS.EXPLANATION_MAX_LENGTH)
    .allow('', null),
  
  orderIndex: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.min': 'Order index must be at least 0',
    }),
}).min(1);

// Problem Query Params Schema
const getProblemsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  difficulty: Joi.string().valid(...Object.values(PROBLEM_DIFFICULTY)).optional(),
  tags: Joi.string().trim().optional(),
  search: Joi.string().trim().max(100).optional(),
  isPublic: Joi.boolean().optional(),
  sortBy: Joi.string().valid('createdAt', 'title', 'difficulty').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createProblemSchema,
  updateProblemSchema,
  createTestCaseSchema,
  updateTestCaseSchema,
  getProblemsSchema,
};
