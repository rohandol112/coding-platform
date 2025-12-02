import { register, login, getUserFromToken, changePassword, forgotPassword, resetPassword } from '../../../../services/portal/auth/jwt/jwtAuthService.js';
import { registerSchema, loginSchema, changePasswordSchema, emailSchema, resetPasswordSchema } from '../../../../validation/portalAuthSchema.js';
import { authMessages } from '../../../../constant/messages.js';

/**
 * Handle user registration (Portal)
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
 * Handle user login (Portal)
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
 * Handle get user profile (Portal)
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
 * Handle change password (Portal)
 */
export const changePasswordController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: authMessages.noTokenProvided });
    }
    const token = authHeader.substring(7);
    const decoded = await getUserFromToken(token);
    const { error, value } = changePasswordSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: authMessages.validationError, errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) });
    }
    const result = await changePassword(decoded.id, value);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
