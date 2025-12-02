export const authProviders = {
  local: 'LOCAL',
  google: 'GOOGLE',
  phone: 'PHONE'
};

export const userRoles = {
  user: 'USER',
  admin: 'ADMIN',
  moderator: 'MODERATOR'
};

export const otpExpiration = 10 * 60 * 1000; // 10 minutes in milliseconds
export const otpLength = 6;
export const maxOtpAttempts = 5;
