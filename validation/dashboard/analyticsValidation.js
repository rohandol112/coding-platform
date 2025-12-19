import Joi from 'joi';
import { analyticsMessages } from '../../constant/userMessages.js';

export const getSubmissionStatsSchema = Joi.object({
  startDate: Joi.date().iso().messages({
    'date.format': analyticsMessages.invalidDateFormat
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).messages({
    'date.format': analyticsMessages.invalidDateFormat,
    'date.greater': analyticsMessages.endDateMustBeAfterStart
  })
});
