import Joi from 'joi';

export const createEditorialSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(10).required(),
  approach: Joi.string().min(10).max(5000),
  complexity: Joi.string().max(500),
  codeExamples: Joi.array().items(
    Joi.object({
      language: Joi.string().required(),
      code: Joi.string().required(),
      explanation: Joi.string()
    })
  ),
  relatedTopics: Joi.array().items(Joi.string()),
  isPublished: Joi.boolean()
});

export const updateEditorialSchema = Joi.object({
  title: Joi.string().min(5).max(200),
  content: Joi.string().min(10),
  approach: Joi.string().min(10).max(5000),
  complexity: Joi.string().max(500),
  codeExamples: Joi.array().items(
    Joi.object({
      language: Joi.string().required(),
      code: Joi.string().required(),
      explanation: Joi.string()
    })
  ),
  relatedTopics: Joi.array().items(Joi.string()),
  isPublished: Joi.boolean()
}).min(1);

export const createHintSchema = Joi.object({
  content: Joi.string().min(10).max(1000).required(),
  orderIndex: Joi.number().integer().min(1).max(5).required(),
  penalty: Joi.number().integer().min(0).max(100).default(0)
});

export const updateHintSchema = Joi.object({
  content: Joi.string().min(10).max(1000),
  orderIndex: Joi.number().integer().min(1).max(5),
  penalty: Joi.number().integer().min(0).max(100)
}).min(1);
