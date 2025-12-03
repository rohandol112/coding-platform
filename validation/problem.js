/**
 * Problem Validation Schemas
 */

import Joi from 'joi';
import { problemDifficulty, problemLimits, testCaseLimits, problemMessages } from '../constant/problem.js';

// Create Problem Schema
const createProblemSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(problemLimits.titleMaxLength)
    .required()
    .messages({
      'string.empty': problemMessages.titleRequired,
      'string.max': `Title must not exceed ${problemLimits.titleMaxLength} characters`,
      'any.required': problemMessages.titleRequired,
    }),
  
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(problemLimits.slugMaxLength)
    .optional()
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  
  difficulty: Joi.string()
    .valid(...Object.values(problemDifficulty))
    .required()
    .messages({
      'any.only': problemMessages.invalidDifficulty,
      'any.required': problemMessages.difficultyRequired,
    }),
  
  tags: Joi.array()
    .items(
      Joi.string()
        .trim()
        .max(problemLimits.tagMaxLength)
        .pattern(/^[a-zA-Z0-9-\s]+$/)
    )
    .max(problemLimits.maxTags)
    .default([])
    .messages({
      'array.max': problemMessages.tooManyTags,
      'string.pattern.base': problemMessages.invalidTag,
    }),
  
  statement: Joi.string()
    .trim()
    .max(problemLimits.statementMaxLength)
    .required()
    .messages({
      'string.empty': problemMessages.statementRequired,
      'string.max': `Statement must not exceed ${problemLimits.statementMaxLength} characters`,
      'any.required': problemMessages.statementRequired,
    }),
  
  inputFormat: Joi.string()
    .trim()
    .max(problemLimits.inputFormatMaxLength)
    .allow('', null)
    .optional(),
  
  outputFormat: Joi.string()
    .trim()
    .max(problemLimits.outputFormatMaxLength)
    .allow('', null)
    .optional(),
  
  constraints: Joi.string()
    .trim()
    .max(problemLimits.constraintsMaxLength)
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
    .max(problemLimits.hintsMaxLength)
    .allow('', null)
    .optional(),
  
  solutionApproach: Joi.string()
    .trim()
    .max(problemLimits.solutionApproachMaxLength)
    .allow('', null)
    .optional(),
  
  timeLimit: Joi.number()
    .integer()
    .min(problemLimits.minTimeLimit)
    .max(problemLimits.maxTimeLimit)
    .default(problemLimits.defaultTimeLimit)
    .messages({
      'number.min': `Time limit must be at least ${problemLimits.minTimeLimit}ms`,
      'number.max': `Time limit must not exceed ${problemLimits.maxTimeLimit}ms`,
    }),
  
  memoryLimit: Joi.number()
    .integer()
    .min(problemLimits.minMemoryLimit)
    .max(problemLimits.maxMemoryLimit)
    .default(problemLimits.defaultMemoryLimit)
    .messages({
      'number.min': `Memory limit must be at least ${problemLimits.minMemoryLimit}KB`,
      'number.max': `Memory limit must not exceed ${problemLimits.maxMemoryLimit}KB`,
    }),
  
  sourceLimit: Joi.number()
    .integer()
    .min(problemLimits.minSourceLimit)
    .max(problemLimits.maxSourceLimit)
    .default(problemLimits.defaultSourceLimit)
    .messages({
      'number.min': `Source limit must be at least ${problemLimits.minSourceLimit} bytes`,
      'number.max': `Source limit must not exceed ${problemLimits.maxSourceLimit} bytes`,
    }),
  
  isPublic: Joi.boolean().default(false),
});

// Update Problem Schema
const updateProblemSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(problemLimits.titleMaxLength)
    .messages({
      'string.max': `Title must not exceed ${problemLimits.titleMaxLength} characters`,
    }),
  
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .max(problemLimits.slugMaxLength)
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  
  difficulty: Joi.string()
    .valid(...Object.values(problemDifficulty))
    .messages({
      'any.only': problemMessages.invalidDifficulty,
    }),
  
  tags: Joi.array()
    .items(
      Joi.string()
        .trim()
        .max(problemLimits.tagMaxLength)
        .pattern(/^[a-zA-Z0-9-\s]+$/)
    )
    .max(problemLimits.maxTags)
    .messages({
      'array.max': problemMessages.tooManyTags,
      'string.pattern.base': problemMessages.invalidTag,
    }),
  
  statement: Joi.string()
    .trim()
    .max(problemLimits.statementMaxLength)
    .messages({
      'string.max': `Statement must not exceed ${problemLimits.statementMaxLength} characters`,
    }),
  
  inputFormat: Joi.string()
    .trim()
    .max(problemLimits.inputFormatMaxLength)
    .allow('', null),
  
  outputFormat: Joi.string()
    .trim()
    .max(problemLimits.outputFormatMaxLength)
    .allow('', null),
  
  constraints: Joi.string()
    .trim()
    .max(problemLimits.constraintsMaxLength)
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
    .max(problemLimits.hintsMaxLength)
    .allow('', null),
  
  solutionApproach: Joi.string()
    .trim()
    .max(problemLimits.solutionApproachMaxLength)
    .allow('', null),
  
  timeLimit: Joi.number()
    .integer()
    .min(problemLimits.minTimeLimit)
    .max(problemLimits.maxTimeLimit)
    .messages({
      'number.min': `Time limit must be at least ${problemLimits.minTimeLimit}ms`,
      'number.max': `Time limit must not exceed ${problemLimits.maxTimeLimit}ms`,
    }),
  
  memoryLimit: Joi.number()
    .integer()
    .min(problemLimits.minMemoryLimit)
    .max(problemLimits.maxMemoryLimit)
    .messages({
      'number.min': `Memory limit must be at least ${problemLimits.minMemoryLimit}KB`,
      'number.max': `Memory limit must not exceed ${problemLimits.maxMemoryLimit}KB`,
    }),
  
  sourceLimit: Joi.number()
    .integer()
    .min(problemLimits.minSourceLimit)
    .max(problemLimits.maxSourceLimit)
    .messages({
      'number.min': `Source limit must be at least ${problemLimits.minSourceLimit} bytes`,
      'number.max': `Source limit must not exceed ${problemLimits.maxSourceLimit} bytes`,
    }),
  
  isPublic: Joi.boolean(),
}).min(1);

// Create Test Case Schema
const createTestCaseSchema = Joi.object({
  input: Joi.string()
    .max(testCaseLimits.inputMaxSize)
    .required()
    .messages({
      'string.empty': 'Test case input is required',
      'string.max': `Input must not exceed ${testCaseLimits.inputMaxSize} bytes`,
      'any.required': 'Test case input is required',
    }),
  
  expectedOutput: Joi.string()
    .max(testCaseLimits.outputMaxSize)
    .required()
    .messages({
      'string.empty': 'Expected output is required',
      'string.max': `Output must not exceed ${testCaseLimits.outputMaxSize} bytes`,
      'any.required': 'Expected output is required',
    }),
  
  isHidden: Joi.boolean().default(true),
  
  points: Joi.number()
    .integer()
    .min(testCaseLimits.minPoints)
    .max(testCaseLimits.maxPoints)
    .default(testCaseLimits.defaultPoints)
    .messages({
      'number.min': `Points must be at least ${testCaseLimits.minPoints}`,
      'number.max': `Points must not exceed ${testCaseLimits.maxPoints}`,
    }),
  
  explanation: Joi.string()
    .trim()
    .max(testCaseLimits.explanationMaxLength)
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
    .max(testCaseLimits.inputMaxSize)
    .messages({
      'string.max': `Input must not exceed ${testCaseLimits.inputMaxSize} bytes`,
    }),
  
  expectedOutput: Joi.string()
    .max(testCaseLimits.outputMaxSize)
    .messages({
      'string.max': `Output must not exceed ${testCaseLimits.outputMaxSize} bytes`,
    }),
  
  isHidden: Joi.boolean(),
  
  points: Joi.number()
    .integer()
    .min(testCaseLimits.minPoints)
    .max(testCaseLimits.maxPoints)
    .messages({
      'number.min': `Points must be at least ${testCaseLimits.minPoints}`,
      'number.max': `Points must not exceed ${testCaseLimits.maxPoints}`,
    }),
  
  explanation: Joi.string()
    .trim()
    .max(testCaseLimits.explanationMaxLength)
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
  difficulty: Joi.string().valid(...Object.values(problemDifficulty)).optional(),
  tags: Joi.string().trim().optional(),
  search: Joi.string().trim().max(100).optional(),
  isPublic: Joi.boolean().optional(),
  sortBy: Joi.string().valid('createdAt', 'title', 'difficulty').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export {
  createProblemSchema,
  updateProblemSchema,
  createTestCaseSchema,
  updateTestCaseSchema,
  getProblemsSchema,
};
