import { PrismaClient } from '@prisma/client';
import { getGoogleUserInfo, verifyGoogleToken } from '../../../../library/googleOAuth.js';
import { generateToken } from '../../../../library/jwtUtil.js';
import { authProviders } from '../../../../constant/authConstants.js';

const prisma = new PrismaClient();

export const googleLogin = async (code, role = 'ADMIN') => {
  try {
    const googleUser = await getGoogleUserInfo(code);
    let user = await prisma.user.findFirst({ where: { OR: [{ email: googleUser.email }, { providerId: googleUser.googleId, provider: authProviders.google }] } });
    if (!user) {
      user = await prisma.user.create({ data: { email: googleUser.email, firstName: googleUser.firstName, lastName: googleUser.lastName, avatar: googleUser.avatar, provider: authProviders.google, providerId: googleUser.googleId, role: role, isActive: true, isVerified: true } });
    } else if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      throw new Error('Access denied. Admin or Moderator role required');
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, role: user.role }, token };
  } catch (error) {
    throw new Error(error.message || 'Google authentication failed');
  }
};

export const googleTokenLogin = async (idToken) => {
  try {
    const googleUser = await verifyGoogleToken(idToken);
    if (!googleUser) throw new Error('Invalid Google token');
    let user = await prisma.user.findFirst({ where: { OR: [{ email: googleUser.email }, { providerId: googleUser.googleId, provider: authProviders.google }] } });
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      throw new Error('Access denied. Admin or Moderator role required');
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, role: user.role }, token };
  } catch (error) {
    throw new Error(error.message || 'Google token authentication failed');
  }
};
