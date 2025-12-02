import prisma from '../../../../library/prisma.js';
import { sendOtp, verifyOtp } from '../../../../library/twilioSms.js';
import { generateToken } from '../../../../library/jwtUtil.js';
import { authProviders, userRoles } from '../../../../constant/authConstants.js';
import { authMessages } from '../../../../constant/messages.js';

export const sendPhoneOtp = async (phoneNumber) => {
  try {
    const result = await sendOtp(phoneNumber);
    return { success: true, message: authMessages.otpSent, status: result.status };
  } catch (error) {
    throw new Error(error.message || authMessages.otpSendFailed);
  }
};

export const verifyPhoneOtp = async (phoneNumber, code, userData) => {
  try {
    const result = await verifyOtp(phoneNumber, code);
    if (!result.success) throw new Error(authMessages.invalidOtp);
    const user = await prisma.user.upsert({
      where: { phone: phoneNumber },
      update: { lastLoginAt: new Date() },
      create: {
        phone: phoneNumber,
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || `${phoneNumber}@phone.local`,
        provider: authProviders.phone,
        role: userRoles.user,
        isActive: true,
        isVerified: true
      }
    });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role, isVerified: user.isVerified }, token };
  } catch (error) {
    throw new Error(error.message || authMessages.otpVerificationFailed);
  }
};
