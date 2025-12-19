import Joi from 'joi';
import { submissionAdminMessages } from '../../constant/userMessages.js';

export const getSubmissionsSchema = Joi.object({
  page: Joi.number().integer().min(1).messages({
    'number.min': submissionAdminMessages.pageMinValue
  }),
  limit: Joi.number().integer().min(1).max(100).messages({
    'number.min': submissionAdminMessages.limitMinValue,
    'number.max': submissionAdminMessages.limitMaxValue
  }),
  userId: Joi.string().uuid().messages({
    'string.guid': submissionAdminMessages.invalidUserId
  }),
  problemId: Joi.string().uuid().messages({
    'string.guid': submissionAdminMessages.invalidProblemId
  }),
  status: Joi.string().valid('QUEUED', 'RUNNING', 'COMPILE_ERROR', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'MEMORY_LIMIT_EXCEEDED', 'ACCEPTED', 'PARTIAL', 'FAILED').messages({
    'any.only': submissionAdminMessages.invalidStatus
  }),
  language: Joi.string().min(1).max(50).messages({
    'string.max': submissionAdminMessages.languageMaxLength
  }),
  startDate: Joi.date().iso().messages({
    'date.format': submissionAdminMessages.invalidDateFormat
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).messages({
    'date.format': submissionAdminMessages.invalidDateFormat,
    'date.greater': submissionAdminMessages.endDateMustBeAfterStart
  }),
  sortBy: Joi.string().valid('createdAt', 'status', 'language', 'time', 'memory', 'score').messages({
    'any.only': submissionAdminMessages.invalidSortBy
  }),
  sortOrder: Joi.string().valid('asc', 'desc').messages({
    'any.only': submissionAdminMessages.invalidSortOrder
  })
});
