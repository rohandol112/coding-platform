/**
 * Submission Constants and Messages
 */

// Submission Status
const submissionStatus = {
  queued: 'QUEUED',
  running: 'RUNNING',
  compileError: 'COMPILE_ERROR',
  wrongAnswer: 'WRONG_ANSWER',
  timeLimitExceeded: 'TIME_LIMIT_EXCEEDED',
  runtimeError: 'RUNTIME_ERROR',
  memoryLimitExceeded: 'MEMORY_LIMIT_EXCEEDED',
  accepted: 'ACCEPTED',
  partial: 'PARTIAL',
  failed: 'FAILED',
};

// Submission Messages
const submissionMessages = {
  // Success
  created: 'Submission created successfully',
  judged: 'Submission judged successfully',
  retrieved: 'Submission retrieved successfully',
  
  // Errors
  notFound: 'Submission not found',
  problemNotFound: 'Problem not found',
  contestNotFound: 'Contest not found',
  contestNotRunning: 'Contest is not running',
  userNotRegistered: 'User not registered for this contest',
  judgeFailed: 'Failed to judge submission',
  rateLimitExceeded: 'Submission rate limit exceeded. Please wait before submitting again',
  createFailed: 'Failed to create submission',
  fetchFailed: 'Failed to get submission',
  userSubmissionsFailed: 'Failed to get user submissions',
  updateStatusFailed: 'Failed to update submission status',
  updateResultFailed: 'Failed to update submission result',
  
  // Judge0 Service
  judge0SubmitFailed: 'Failed to submit code to Judge0',
  judge0FetchFailed: 'Failed to fetch result from Judge0',
  judge0Timeout: 'Submission polling timeout',
  
  // Validation
  codeRequired: 'Source code is required',
  languageRequired: 'Programming language is required',
  problemIdRequired: 'Problem ID is required',
  invalidLanguage: 'Invalid programming language',
  codeTooLarge: 'Source code exceeds maximum allowed size',
  validationFailed: 'Validation failed',
  userOrProblemNotFound: 'User or Problem not found',
  
  // Authorization
  unauthorized: 'Not authorized to access this submission',
};

module.exports = {
  submissionStatus,
  submissionMessages,
};
