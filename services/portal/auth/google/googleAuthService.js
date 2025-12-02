import { PrismaClient } from '@prisma/client';
import { getGoogleUserInfo, verifyGoogleToken } from '../../../../library/googleOAuth.js';
import { generateToken } from '../../../../library/jwtUtil.js';
import { authProviders } from '../../../../constant/authConstants.js';

const prisma = new PrismaClient();

export const googleLogin = async (code) => {
  try {
    const googleUser = await getGoogleUserInfo(code);
    let user = await prisma.user.findFirst({ where: { OR: [{ email: googleUser.email }, { providerId: googleUser.googleId, provider: authProviders.google }] } });
    if (!user) {
      user = await prisma.user.create({ data: { email: googleUser.email, firstName: googleUser.firstName, lastName: googleUser.lastName, avatar: googleUser.avatar, provider: authProviders.google, providerId: googleUser.googleId, role: 'USER', isActive: true, isVerified: true } });
    } else if (user.provider !== authProviders.google) {
      await prisma.user.update({ where: { id: user.id }, data: { provider: authProviders.google, providerId: googleUser.googleId, isVerified: true } });
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, role: user.role, isVerified: user.isVerified }, token };
  } catch (error) {
    throw new Error(error.message || 'Google authentication failed');
  }
};

export const googleTokenLogin = async (idToken) => {
  try {
    const googleUser = await verifyGoogleToken(idToken);
    if (!googleUser) throw new Error('Invalid Google token');
    let user = await prisma.user.findFirst({ where: { OR: [{ email: googleUser.email }, { providerId: googleUser.googleId, provider: authProviders.google }] } });
    if (!user) {
      user = await prisma.user.create({ data: { email: googleUser.email, firstName: googleUser.firstName, lastName: googleUser.lastName, avatar: googleUser.avatar, provider: authProviders.google, providerId: googleUser.googleId, role: 'USER', isActive: true, isVerified: true } });
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, role: user.role, isVerified: user.isVerified }, token };
  } catch (error) {
    throw new Error(error.message || 'Google token authentication failed');
  }
};
