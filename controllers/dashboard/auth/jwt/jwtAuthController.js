import { register, login, getUserFromToken, forgotPassword, resetPassword } from '../../../../services/dashboard/auth/jwt/jwtAuthService.js';
import { registerSchema, loginSchema, emailSchema, resetPasswordSchema } from '../../../../validation/jwtAuthSchema.js';
import { authMessages } from '../../../../constant/messages.js';

/**
 * Handle user registration
 */
export const registerController = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: authMessages.validationError, errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) });
    }
    const result = await register(value);
    res.status(201).json({ success: true, message: authMessages.registerSuccess, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Handle user login
 */
export const loginController = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: authMessages.validationError, errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) });
    }
    const result = await login(value);
    res.status(200).json({ success: true, message: authMessages.loginSuccess, data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * Handle get user profile
 */
export const profileController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: authMessages.noTokenProvided });
    }
    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * Handle forgot password request (Dashboard)
 */
export const forgotPasswordController = async (req, res) => {
  try {
    const { error, value } = emailSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: authMessages.validationError, errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) });
    }
    const result = await forgotPassword(value.email);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Handle password reset (Dashboard)
 */
export const resetPasswordController = async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: authMessages.validationError, errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) });
    }
    const result = await resetPassword(value.token, value.newPassword);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
