// Authentication Messages
export const authMessages = {
  // Success messages
  registerSuccess: 'User registered successfully',
  loginSuccess: 'Login successful',
  otpSent: 'OTP sent successfully',
  otpVerified: 'OTP verified successfully',
  googleAuthSuccess: 'Google authentication successful',
  passwordChanged: 'Password changed successfully',
  
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
  
  // Validation messages
  validationError: 'Validation error',
  emailRequired: 'Email is required',
  emailInvalid: 'Please provide a valid email address',
  passwordRequired: 'Password is required',
  passwordMinLength: 'Password must be at least 8 characters long',
  firstNameRequired: 'First name is required',
  firstNameMinLength: 'First name must be at least 2 characters long',
  lastNameRequired: 'Last name is required',
  lastNameMinLength: 'Last name must be at least 2 characters long',
  phoneRequired: 'Phone number is required',
  phoneInvalid: 'Please provide a valid phone number',
  otpRequired: 'OTP is required',
  otpInvalid: 'OTP must be 6 digits'
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
