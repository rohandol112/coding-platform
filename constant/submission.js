/**
 * Submission Constants and Messages
 */

// Submission Status
const SUBMISSION_STATUS = {
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  COMPILE_ERROR: 'COMPILE_ERROR',
  WRONG_ANSWER: 'WRONG_ANSWER',
  TIME_LIMIT_EXCEEDED: 'TIME_LIMIT_EXCEEDED',
  RUNTIME_ERROR: 'RUNTIME_ERROR',
  MEMORY_LIMIT_EXCEEDED: 'MEMORY_LIMIT_EXCEEDED',
  ACCEPTED: 'ACCEPTED',
  PARTIAL: 'PARTIAL',
  FAILED: 'FAILED',
};

// Submission Messages
const SUBMISSION_MESSAGES = {
  // Success
  CREATED: 'Submission created successfully',
  JUDGED: 'Submission judged successfully',
  RETRIEVED: 'Submission retrieved successfully',
  
  // Errors
  NOT_FOUND: 'Submission not found',
  PROBLEM_NOT_FOUND: 'Problem not found',
  CONTEST_NOT_FOUND: 'Contest not found',
  CONTEST_NOT_RUNNING: 'Contest is not running',
  USER_NOT_REGISTERED: 'User not registered for this contest',
  JUDGE_FAILED: 'Failed to judge submission',
  RATE_LIMIT_EXCEEDED: 'Submission rate limit exceeded. Please wait before submitting again',
  
  // Validation
  CODE_REQUIRED: 'Source code is required',
  LANGUAGE_REQUIRED: 'Programming language is required',
  PROBLEM_ID_REQUIRED: 'Problem ID is required',
  INVALID_LANGUAGE: 'Invalid programming language',
  CODE_TOO_LARGE: 'Source code exceeds maximum allowed size',
  
  // Authorization
  UNAUTHORIZED: 'Not authorized to access this submission',
};

module.exports = {
  SUBMISSION_STATUS,
  SUBMISSION_MESSAGES,
};
