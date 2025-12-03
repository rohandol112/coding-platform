import Joi from 'joi';

export const getSubmissionsSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  userId: Joi.string().uuid(),
  problemId: Joi.string().uuid(),
  status: Joi.string().valid('QUEUED', 'RUNNING', 'COMPILE_ERROR', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'MEMORY_LIMIT_EXCEEDED', 'ACCEPTED', 'PARTIAL', 'FAILED'),
  language: Joi.string().min(1).max(50),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')),
  sortBy: Joi.string().valid('createdAt', 'status', 'language', 'time', 'memory', 'score'),
  sortOrder: Joi.string().valid('asc', 'desc')
});
