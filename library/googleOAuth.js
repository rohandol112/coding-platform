import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
  throw new Error('Missing required Google OAuth environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI');
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

export const getGoogleAuthUrl = () => {
  return client.generateAuthUrl({ access_type: 'offline', scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] });
};

export const getGoogleUserInfo = async (code) => {
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    return { email: payload.email, firstName: payload.given_name || '', lastName: payload.family_name || '', avatar: payload.picture || null, googleId: payload.sub };
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    throw new Error('Failed to verify Google token');
  }
};

export const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    return { email: payload.email, firstName: payload.given_name || '', lastName: payload.family_name || '', avatar: payload.picture || null, googleId: payload.sub };
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    throw new Error('Failed to verify Google token');
  }
};
