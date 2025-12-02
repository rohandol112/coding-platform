import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import { libraryMessages } from '../constant/messages.js';

/**
 * @typedef {import('../types/index.js').GoogleUserInfo} GoogleUserInfo
 */

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
  throw new Error(libraryMessages.missingGoogleEnv);
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

/**
 * Generate Google OAuth authorization URL
 * @returns {string} Authorization URL
 */
export const getGoogleAuthUrl = () => {
  return client.generateAuthUrl({ access_type: 'offline', scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] });
};

/**
 * Get Google user info from authorization code
 * @param {string} code - Authorization code from Google OAuth callback
 * @returns {Promise<GoogleUserInfo>} Google user information
 * @throws {Error} If token verification fails
 */
export const getGoogleUserInfo = async (code) => {
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    return { email: payload.email, firstName: payload.given_name || '', lastName: payload.family_name || '', avatar: payload.picture || null, googleId: payload.sub };
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    throw new Error(libraryMessages.googleTokenVerifyFailed);
  }
};

/**
 * Verify Google ID token and extract user info
 * @param {string} token - Google ID token
 * @returns {Promise<GoogleUserInfo>} Google user information
 * @throws {Error} If token verification fails
 */
export const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    return { email: payload.email, firstName: payload.given_name || '', lastName: payload.family_name || '', avatar: payload.picture || null, googleId: payload.sub };
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    throw new Error(libraryMessages.googleTokenVerifyFailed);
  }
};
