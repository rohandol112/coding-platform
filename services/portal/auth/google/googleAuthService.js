import prisma from '../../../../library/prisma.js';
import { getGoogleUserInfo, verifyGoogleToken } from '../../../../library/googleOAuth.js';
import { generateToken } from '../../../../library/jwtUtil.js';
import { authProviders, userRoles } from '../../../../constant/authConstants.js';
import { authMessages } from '../../../../constant/messages.js';

export const googleLogin = async (code) => {
  try {
    const googleUser = await getGoogleUserInfo(code);
    let user = await prisma.user.findFirst({ where: { OR: [{ email: googleUser.email }, { providerId: googleUser.googleId, provider: authProviders.google }] } });
    if (!user) {
      user = await prisma.user.create({ data: { email: googleUser.email, firstName: googleUser.firstName, lastName: googleUser.lastName, avatar: googleUser.avatar, provider: authProviders.google, providerId: googleUser.googleId, role: userRoles.user, isActive: true, isVerified: true } });
    } else if (user.provider !== authProviders.google) {
      await prisma.user.update({ where: { id: user.id }, data: { provider: authProviders.google, providerId: googleUser.googleId, isVerified: true } });
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, role: user.role, isVerified: user.isVerified }, token };
  } catch (error) {
    throw new Error(error.message || authMessages.googleAuthFailed);
  }
};

export const googleTokenLogin = async (idToken) => {
  try {
    const googleUser = await verifyGoogleToken(idToken);
    if (!googleUser) throw new Error(authMessages.invalidGoogleToken);
    let user = await prisma.user.findFirst({ where: { OR: [{ email: googleUser.email }, { providerId: googleUser.googleId, provider: authProviders.google }] } });
    if (!user) {
      user = await prisma.user.create({ data: { email: googleUser.email, firstName: googleUser.firstName, lastName: googleUser.lastName, avatar: googleUser.avatar, provider: authProviders.google, providerId: googleUser.googleId, role: userRoles.user, isActive: true, isVerified: true } });
    } else if (user.provider !== authProviders.google) {
      await prisma.user.update({ where: { id: user.id }, data: { provider: authProviders.google, providerId: googleUser.googleId, isVerified: true } });
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, role: user.role, isVerified: user.isVerified }, token };
  } catch (error) {
    throw new Error(error.message || authMessages.googleTokenAuthFailed);
  }
};
