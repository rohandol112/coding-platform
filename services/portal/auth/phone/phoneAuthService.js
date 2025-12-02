import { PrismaClient } from '@prisma/client';
import { sendOtp, verifyOtp } from '../../../../library/twilioSms.js';
import { generateToken } from '../../../../library/jwtUtil.js';
import { authProviders } from '../../../../constant/authConstants.js';

const prisma = new PrismaClient();

export const sendPhoneOtp = async (phoneNumber) => {
  try {
    const result = await sendOtp(phoneNumber);
    return { success: true, message: 'OTP sent successfully', status: result.status };
  } catch (error) {
    throw new Error(error.message || 'Failed to send OTP');
  }
};

export const verifyPhoneOtp = async (phoneNumber, code, userData) => {
  try {
    const result = await verifyOtp(phoneNumber, code);
    if (!result.success) throw new Error('Invalid or expired OTP');
    let user = await prisma.user.findUnique({ where: { phone: phoneNumber } });
    if (!user) {
      user = await prisma.user.create({ data: { phone: phoneNumber, firstName: userData?.firstName || '', lastName: userData?.lastName || '', email: userData?.email || `${phoneNumber}@phone.local`, provider: authProviders.phone, role: 'USER', isActive: true, isVerified: true } });
    } else {
      await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    }
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role, isVerified: user.isVerified }, token };
  } catch (error) {
    throw new Error(error.message || 'OTP verification failed');
  }
};
