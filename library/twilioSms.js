import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_SERVICE_SID) {
  throw new Error('Missing required Twilio environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID');
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOtp = async (phoneNumber) => {
  try {
    const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verifications.create({ to: phoneNumber, channel: 'sms' });
    return { success: true, status: verification.status };
  } catch (error) {
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

export const verifyOtp = async (phoneNumber, code) => {
  try {
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verificationChecks.create({ to: phoneNumber, code });
    return { success: verificationCheck.status === 'approved', status: verificationCheck.status };
  } catch (error) {
    throw new Error(`Failed to verify OTP: ${error.message}`);
  }
};
