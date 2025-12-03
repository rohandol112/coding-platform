// Authentication Messages
export const authMessages = {
  // Success messages
  registerSuccess: 'User registered successfully',
  loginSuccess: 'Login successful',
  otpSent: 'OTP sent successfully',
  otpVerified: 'OTP verified successfully',
  googleAuthSuccess: 'Google authentication successful',
  googleLoginSuccess: 'Google login successful',
  googleAdminLoginSuccess: 'Google admin login successful',
  phoneVerificationSuccess: 'Phone verification successful',
  passwordChanged: 'Password changed successfully',
  resetLinkSent: 'Password reset link sent to your email',
  passwordReset: 'Password reset successfully',
  invalidResetToken: 'Invalid or expired reset token',
  cannotResetOAuthPassword: 'Cannot reset password for OAuth accounts',
  // Error messages
  userExists: 'User with this email already exists',
  usernameExists: 'Username already taken',
  phoneExists: 'Phone number already registered',
  invalidCredentials: 'Invalid email or password',
  invalidToken: 'Invalid or expired token',
  invalidGoogleToken: 'Invalid Google token',
  userNotFound: 'User not found',
  noTokenProvided: 'No token provided',
  invalidOtp: 'Invalid or expired OTP',
  otpSendFailed: 'Failed to send OTP',
  otpVerificationFailed: 'OTP verification failed',
  googleAuthFailed: 'Google authentication failed',
  googleTokenAuthFailed: 'Google token authentication failed',
  accessDenied: 'Access denied',
  accessDeniedContactAdmin: 'Access denied. Please contact an administrator to request access.',
  accessDeniedAdminOnly: 'Access denied. Admin or Moderator role required',
  accountDeactivated: 'Account is deactivated',
  useGoogleLogin: 'Please use Google login for this account',
  useGoogleOrPhoneLogin: 'Please use Google or Phone login for this account',
  incorrectPassword: 'Current password is incorrect',
  forgotPassword: 'Password reset email sent successfully',
  // Validation messages
  validationError: 'Validation error',
  emailRequired: 'Email is required',
  emailInvalid: 'Please provide a valid email address',
  passwordRequired: 'Password is required',
  passwordMinLength: 'Password must be at least 8 characters long',
  passwordMaxLength: 'Password must not exceed 128 characters',
  passwordPattern: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  passwordsDoNotMatch: 'Passwords do not match',
  confirmPasswordRequired: 'Please confirm your password',
  confirmNewPasswordRequired: 'Please confirm your new password',
  newPasswordRequired: 'New password is required',
  newPasswordDifferent: 'New password must be different from current password',
  firstNameRequired: 'First name is required',
  firstNameMinLength: 'First name must be at least 2 characters long',
  firstNameMaxLength: 'First name must not exceed 50 characters',
  lastNameRequired: 'Last name is required',
  lastNameMinLength: 'Last name must be at least 2 characters long',
  lastNameMaxLength: 'Last name must not exceed 50 characters',
  usernameMinLength: 'Username must be at least 3 characters long',
  usernameMaxLength: 'Username must not exceed 30 characters',
  usernameAlphanum: 'Username must contain only letters and numbers',
  phoneRequired: 'Phone number is required',
  phoneInvalid: 'Please provide a valid phone number',
  phoneInvalidE164: 'Please provide a valid phone number in E.164 format',
  otpRequired: 'OTP is required',
  otpInvalid: 'OTP must be 6 digits',
  otpMustBeNumeric: 'OTP must contain only numbers',
  otpLength: 'OTP must be 6 digits',
  roleInvalid: 'Role must be one of: USER, ADMIN, MODERATOR',
  tokenRequired: 'Reset token is required',
  authCodeRequired: 'Authorization code is required',
  googleTokenRequired: 'Google ID token is required',
  identifierRequired: 'Email, username, or phone is required',
  currentPasswordRequired: 'Current password is required'
};

// Server Messages
export const serverMessages = {
  healthOk: 'Server is running',
  routeNotFound: 'Route not found',
  internalError: 'Internal server error'
};

// HTTP Status Messages
export const httpMessages = {
  success: 'success',
  error: 'error'
};

// Library Error Messages
export const libraryMessages = {
  missingEmailEnv: 'Missing required email environment variables: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD',
  missingGoogleEnv: 'Missing required Google OAuth environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI',
  missingTwilioEnv: 'Missing required Twilio environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID',
  emailSendFailed: 'Failed to send password reset email',
  googleTokenVerifyFailed: 'Failed to verify Google token',
  otpSendError: 'Failed to send OTP',
  otpVerifyError: 'Failed to verify OTP'
};

// Re-export user management messages
export * from './userMessages.js';
