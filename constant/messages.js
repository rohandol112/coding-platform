// Authentication Messages
export const authMessages = {
  // Success messages
  registerSuccess: 'User registered successfully',
  loginSuccess: 'Login successful',
  otpSent: 'OTP sent successfully',
  otpVerified: 'OTP verified successfully',
  googleAuthSuccess: 'Google authentication successful',
  
  // Error messages
  userExists: 'User with this email already exists',
  invalidCredentials: 'Invalid email or password',
  invalidToken: 'Invalid or expired token',
  userNotFound: 'User not found',
  noTokenProvided: 'No token provided',
  invalidOtp: 'Invalid or expired OTP',
  otpSendFailed: 'Failed to send OTP',
  googleAuthFailed: 'Google authentication failed',
  accessDenied: 'Access denied',
  
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
