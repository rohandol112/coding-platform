import { sendPhoneOtp, verifyPhoneOtp } from '../../../../services/portal/auth/phone/phoneAuthService.js';
import { phoneOtpSendSchema, phoneOtpVerifySchema } from '../../../../validation/oauthSchema.js';
import { authMessages } from '../../../../constant/messages.js';

export const sendOtpController = async (req, res) => {
  try {
    const { error, value } = phoneOtpSendSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: authMessages.validationError, errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) });
    }
    const result = await sendPhoneOtp(value.phoneNumber);
    res.status(200).json({ success: true, message: result.message, data: { status: result.status } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { error, value } = phoneOtpVerifySchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: authMessages.validationError, errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message })) });
    }
    const result = await verifyPhoneOtp(value.phoneNumber, value.code, { firstName: value.firstName, lastName: value.lastName, email: value.email });
    res.status(200).json({ success: true, message: 'Phone verification successful', data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
