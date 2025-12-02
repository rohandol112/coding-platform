/**
 * Validation Middleware
 * Validates request data using Joi schemas
 */

const { submissionMessages } = require('../constant/submission');

/**
 * Validate middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[property];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: submissionMessages.validationFailed,
        errors,
      });
    }

    // Replace the property with validated and sanitized data
    req[property] = value;
    next();
  };
};

module.exports = { validate };
