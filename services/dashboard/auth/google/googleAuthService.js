import prisma from '../../../../library/prisma.js';
import { getGoogleUserInfo, verifyGoogleToken } from '../../../../library/googleOAuth.js';
import { generateToken } from '../../../../library/jwtUtil.js';
import { authProviders, userRoles } from '../../../../constant/authConstants.js';
import { authMessages } from '../../../../constant/messages.js';

export const googleLogin = async (code, role = 'ADMIN') => {
  try {
    const googleUser = await getGoogleUserInfo(code);
    let user = await prisma.user.findFirst({ where: { OR: [{ email: googleUser.email }, { providerId: googleUser.googleId, provider: authProviders.google }] } });
    if (!user) {
      throw new Error(authMessages.accessDeniedContactAdmin);
    }
    if (user.role !== userRoles.admin && user.role !== userRoles.moderator) {
      throw new Error(authMessages.accessDeniedAdminOnly);
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, role: user.role }, token };
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
      throw new Error(authMessages.accessDeniedContactAdmin);
    }
    if (user.role !== userRoles.admin && user.role !== userRoles.moderator) {
      throw new Error(authMessages.accessDeniedAdminOnly);
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, role: user.role }, token };
  } catch (error) {
    throw new Error(error.message || authMessages.googleTokenAuthFailed);
  }
};
