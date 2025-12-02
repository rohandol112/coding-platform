import { googleLogin, googleTokenLogin } from '../../../../services/portal/auth/google/googleAuthService.js';
import { googleCodeSchema, googleTokenSchema } from '../../../../validation/oauthSchema.js';
import { getGoogleAuthUrl } from '../../../../library/googleOAuth.js';
import { authMessages } from '../../../../constant/messages.js';

export const getAuthUrlController = async (req, res) => {
  try {
    const authUrl = getGoogleAuthUrl();
    res.status(200).json({ success: true, data: { authUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const googleCallbackController = async (req, res) => {
  try {
    const { error, value } = googleCodeSchema.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: authMessages.validationError, errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) });
    }
    const result = await googleLogin(value.code);
    res.status(200).json({ success: true, message: 'Google login successful', data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const googleTokenController = async (req, res) => {
  try {
    const { error, value } = googleTokenSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: authMessages.validationError, errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) });
    }
    const result = await googleTokenLogin(value.idToken);
    res.status(200).json({ success: true, message: 'Google login successful', data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
