import Joi from 'joi';
import { editorialMessages } from '../../constant/userMessages.js';

export const createEditorialSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    'any.required': editorialMessages.titleRequired,
    'string.min': editorialMessages.titleMinLength,
    'string.max': editorialMessages.titleMaxLength
  }),
  content: Joi.string().min(10).required().messages({
    'any.required': editorialMessages.contentRequired,
    'string.min': editorialMessages.contentMinLength
  }),
  approach: Joi.string().min(10).max(5000).messages({
    'string.min': editorialMessages.approachMinLength,
    'string.max': editorialMessages.approachMaxLength
  }),
  complexity: Joi.string().max(500).messages({
    'string.max': editorialMessages.complexityMaxLength
  }),
  codeExamples: Joi.array().items(
    Joi.object({
      language: Joi.string().required().messages({
        'any.required': editorialMessages.codeLanguageRequired
      }),
      code: Joi.string().required().messages({
        'any.required': editorialMessages.codeRequired
      }),
      explanation: Joi.string()
    })
  ),
  relatedTopics: Joi.array().items(Joi.string()),
  isPublished: Joi.boolean()
});

export const updateEditorialSchema = Joi.object({
  title: Joi.string().min(5).max(200).messages({
    'string.min': editorialMessages.titleMinLength,
    'string.max': editorialMessages.titleMaxLength
  }),
  content: Joi.string().min(10).messages({
    'string.min': editorialMessages.contentMinLength
  }),
  approach: Joi.string().min(10).max(5000).messages({
    'string.min': editorialMessages.approachMinLength,
    'string.max': editorialMessages.approachMaxLength
  }),
  complexity: Joi.string().max(500).messages({
    'string.max': editorialMessages.complexityMaxLength
  }),
  codeExamples: Joi.array().items(
    Joi.object({
      language: Joi.string().required().messages({
        'any.required': editorialMessages.codeLanguageRequired
      }),
      code: Joi.string().required().messages({
        'any.required': editorialMessages.codeRequired
      }),
      explanation: Joi.string()
    })
  ),
  relatedTopics: Joi.array().items(Joi.string()),
  isPublished: Joi.boolean()
}).min(1).messages({
  'object.min': editorialMessages.atLeastOneField
});

export const createHintSchema = Joi.object({
  content: Joi.string().min(10).max(1000).required().messages({
    'any.required': editorialMessages.hintContentRequired,
    'string.min': editorialMessages.hintContentMinLength,
    'string.max': editorialMessages.hintContentMaxLength
  }),
  orderIndex: Joi.number().integer().min(1).max(5).required().messages({
    'any.required': editorialMessages.hintOrderRequired,
    'number.min': editorialMessages.hintOrderMin,
    'number.max': editorialMessages.hintOrderMax
  }),
  penalty: Joi.number().integer().min(0).max(100).default(0).messages({
    'number.min': editorialMessages.penaltyMin,
    'number.max': editorialMessages.penaltyMax
  })
});

export const updateHintSchema = Joi.object({
  content: Joi.string().min(10).max(1000).messages({
    'string.min': editorialMessages.hintContentMinLength,
    'string.max': editorialMessages.hintContentMaxLength
  }),
  orderIndex: Joi.number().integer().min(1).max(5).messages({
    'number.min': editorialMessages.hintOrderMin,
    'number.max': editorialMessages.hintOrderMax
  }),
  penalty: Joi.number().integer().min(0).max(100).messages({
    'number.min': editorialMessages.penaltyMin,
    'number.max': editorialMessages.penaltyMax
  })
}).min(1).messages({
  'object.min': editorialMessages.atLeastOneField
});
