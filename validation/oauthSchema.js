import Joi from 'joi';
import { authMessages } from '../constant/messages.js';

/**
 * @typedef {import('../types/index.js').PhoneOtpInput} PhoneOtpInput
 * @typedef {import('../types/index.js').PhoneOtpVerifyInput} PhoneOtpVerifyInput
 */

export const googleCodeSchema = Joi.object({ code: Joi.string().required().messages({ 'any.required': authMessages.authCodeRequired, 'string.empty': authMessages.authCodeRequired }) });

export const googleTokenSchema = Joi.object({ idToken: Joi.string().required().messages({ 'any.required': authMessages.googleTokenRequired, 'string.empty': authMessages.googleTokenRequired }) });

export const phoneOtpSendSchema = Joi.object({ phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({ 'string.pattern.base': authMessages.phoneInvalidE164, 'any.required': authMessages.phoneRequired, 'string.empty': authMessages.phoneRequired }) });

export const phoneOtpVerifySchema = Joi.object({ phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({ 'string.pattern.base': authMessages.phoneInvalidE164, 'any.required': authMessages.phoneRequired, 'string.empty': authMessages.phoneRequired }), code: Joi.string().length(6).pattern(/^\d+$/).required().messages({ 'string.length': authMessages.otpLength, 'string.pattern.base': authMessages.otpMustBeNumeric, 'any.required': authMessages.otpRequired, 'string.empty': authMessages.otpRequired }), firstName: Joi.string().min(2).max(50).optional().trim().messages({ 'string.min': authMessages.firstNameMinLength, 'string.max': authMessages.firstNameMaxLength }), lastName: Joi.string().min(2).max(50).optional().trim().messages({ 'string.min': authMessages.lastNameMinLength, 'string.max': authMessages.lastNameMaxLength }), email: Joi.string().email().optional().lowercase().trim().messages({ 'string.email': authMessages.emailInvalid }) });
