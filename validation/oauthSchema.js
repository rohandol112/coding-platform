import Joi from 'joi';

export const googleCodeSchema = Joi.object({ code: Joi.string().required().messages({ 'any.required': 'Authorization code is required', 'string.empty': 'Authorization code is required' }) });

export const googleTokenSchema = Joi.object({ idToken: Joi.string().required().messages({ 'any.required': 'Google ID token is required', 'string.empty': 'Google ID token is required' }) });

export const phoneOtpSendSchema = Joi.object({ phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({ 'string.pattern.base': 'Please provide a valid phone number in E.164 format', 'any.required': 'Phone number is required', 'string.empty': 'Phone number is required' }) });

export const phoneOtpVerifySchema = Joi.object({ phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({ 'string.pattern.base': 'Please provide a valid phone number in E.164 format', 'any.required': 'Phone number is required', 'string.empty': 'Phone number is required' }), code: Joi.string().length(6).pattern(/^\d+$/).required().messages({ 'string.length': 'OTP must be 6 digits', 'string.pattern.base': 'OTP must contain only numbers', 'any.required': 'OTP code is required', 'string.empty': 'OTP code is required' }), firstName: Joi.string().min(2).max(50).optional().trim().messages({ 'string.min': 'First name must be at least 2 characters', 'string.max': 'First name must not exceed 50 characters' }), lastName: Joi.string().min(2).max(50).optional().trim().messages({ 'string.min': 'Last name must be at least 2 characters', 'string.max': 'Last name must not exceed 50 characters' }), email: Joi.string().email().optional().lowercase().trim().messages({ 'string.email': 'Please provide a valid email address' }) });
