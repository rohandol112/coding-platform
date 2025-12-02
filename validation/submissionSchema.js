/**
 * @fileoverview Joi validation schemas for submission endpoints
 */

const Joi = require('joi');

/** @typedef {import('../types/submissions').CreateSubmissionRequest} CreateSubmissionRequest */

/**
 * Schema for creating a submission
 */
const createSubmissionSchema = Joi.object({
  problemId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Problem ID must be a valid UUID',
      'any.required': 'Problem ID is required',
    }),

  language: Joi.string()
    .valid('javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust', 'typescript', 'kotlin', 'swift', 'ruby', 'php')
    .required()
    .messages({
      'any.only': 'Unsupported language',
      'any.required': 'Language is required',
    }),

  source: Joi.string()
    .min(1)
    .max(65536) // 64 KB
    .required()
    .messages({
      'string.min': 'Source code cannot be empty',
      'string.max': 'Source code exceeds maximum size of 64 KB',
      'any.required': 'Source code is required',
    }),

  stdin: Joi.string()
    .allow('')
    .max(10240) // 10 KB
    .optional()
    .messages({
      'string.max': 'Input exceeds maximum size of 10 KB',
    }),

  isRunOnly: Joi.boolean()
    .optional()
    .default(false),
});

/**
 * Schema for getting a submission
 */
const getSubmissionSchema = Joi.object({
  submissionId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Submission ID must be a valid UUID',
      'any.required': 'Submission ID is required',
    }),
});

module.exports = {
  createSubmissionSchema,
  getSubmissionSchema,
};
