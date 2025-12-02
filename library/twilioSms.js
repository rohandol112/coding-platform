import twilio from 'twilio';
import dotenv from 'dotenv';
import { libraryMessages } from '../constant/messages.js';

dotenv.config();

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_SERVICE_SID) {
  throw new Error(libraryMessages.missingTwilioEnv);
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Send OTP to phone number via Twilio
 * @param {string} phoneNumber - Phone number in E.164 format
 * @returns {Promise<{success: boolean, status: string}>} OTP send status
 * @throws {Error} If OTP sending fails
 */
export const sendOtp = async (phoneNumber) => {
  try {
    const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verifications.create({ to: phoneNumber, channel: 'sms' });
    return { success: true, status: verification.status };
  } catch (error) {
    throw new Error(`${libraryMessages.otpSendError}: ${error.message}`);
  }
};

/**
 * Verify OTP code for phone number
 * @param {string} phoneNumber - Phone number in E.164 format
 * @param {string} code - 6-digit OTP code
 * @returns {Promise<{success: boolean, status: string}>} Verification status
 * @throws {Error} If OTP verification fails
 */
export const verifyOtp = async (phoneNumber, code) => {
  try {
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verificationChecks.create({ to: phoneNumber, code });
    return { success: verificationCheck.status === 'approved', status: verificationCheck.status };
  } catch (error) {
    throw new Error(`${libraryMessages.otpVerifyError}: ${error.message}`);
  }
};
