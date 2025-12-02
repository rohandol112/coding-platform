// Authentication Messages
export const authMessages = {
  // Success messages
  registerSuccess: 'User registered successfully',
  loginSuccess: 'Login successful',
  
  // Error messages
  userExists: 'User with this email already exists',
  invalidCredentials: 'Invalid email or password',
  invalidToken: 'Invalid or expired token',
  userNotFound: 'User not found',
  noTokenProvided: 'No token provided',
  
  // Validation messages
  validationError: 'Validation error',
  emailRequired: 'Email is required',
  emailInvalid: 'Please provide a valid email address',
  passwordRequired: 'Password is required',
  passwordMinLength: 'Password must be at least 8 characters long',
  firstNameRequired: 'First name is required',
  firstNameMinLength: 'First name must be at least 2 characters long',
  lastNameRequired: 'Last name is required',
  lastNameMinLength: 'Last name must be at least 2 characters long'
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
