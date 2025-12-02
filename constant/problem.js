/**
 * Problem Constants and Messages
 */

// Problem Difficulty
const PROBLEM_DIFFICULTY = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
};

// Problem Limits
const PROBLEM_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  SLUG_MAX_LENGTH: 200,
  STATEMENT_MAX_LENGTH: 10000,
  INPUT_FORMAT_MAX_LENGTH: 2000,
  OUTPUT_FORMAT_MAX_LENGTH: 2000,
  CONSTRAINTS_MAX_LENGTH: 2000,
  HINTS_MAX_LENGTH: 3000,
  SOLUTION_APPROACH_MAX_LENGTH: 5000,
  MAX_TAGS: 10,
  TAG_MAX_LENGTH: 50,
  MAX_TEST_CASES: 100,
  DEFAULT_TIME_LIMIT: 1000, // ms
  MIN_TIME_LIMIT: 100, // ms
  MAX_TIME_LIMIT: 10000, // ms
  DEFAULT_MEMORY_LIMIT: 262144, // KB (256 MB)
  MIN_MEMORY_LIMIT: 32768, // KB (32 MB)
  MAX_MEMORY_LIMIT: 524288, // KB (512 MB)
  DEFAULT_SOURCE_LIMIT: 50000, // bytes (50 KB)
  MIN_SOURCE_LIMIT: 1024, // bytes (1 KB)
  MAX_SOURCE_LIMIT: 100000, // bytes (100 KB)
};

// Test Case Limits
const TEST_CASE_LIMITS = {
  INPUT_MAX_SIZE: 1048576, // 1 MB
  OUTPUT_MAX_SIZE: 1048576, // 1 MB
  EXPLANATION_MAX_LENGTH: 1000,
  MIN_POINTS: 0,
  MAX_POINTS: 100,
  DEFAULT_POINTS: 10,
};

// Problem Messages
const PROBLEM_MESSAGES = {
  // Success
  CREATED: 'Problem created successfully',
  UPDATED: 'Problem updated successfully',
  DELETED: 'Problem deleted successfully',
  PUBLISHED: 'Problem published successfully',
  UNPUBLISHED: 'Problem unpublished successfully',
  
  // Test Case Messages
  TEST_CASE_ADDED: 'Test case added successfully',
  TEST_CASE_UPDATED: 'Test case updated successfully',
  TEST_CASE_DELETED: 'Test case deleted successfully',
  TEST_CASE_NOT_FOUND: 'Test case not found',
  
  // Errors
  NOT_FOUND: 'Problem not found',
  SLUG_EXISTS: 'Problem with this slug already exists',
  USED_IN_CONTEST: 'Cannot delete problem as it is used in active contests',
  NO_TEST_CASES: 'Problem must have at least one test case',
  
  // Validation
  TITLE_REQUIRED: 'Problem title is required',
  SLUG_REQUIRED: 'Problem slug is required',
  STATEMENT_REQUIRED: 'Problem statement is required',
  DIFFICULTY_REQUIRED: 'Problem difficulty is required',
  INVALID_DIFFICULTY: 'Invalid problem difficulty',
  INVALID_TIME_LIMIT: 'Invalid time limit',
  INVALID_MEMORY_LIMIT: 'Invalid memory limit',
  INVALID_SOURCE_LIMIT: 'Invalid source limit',
  TOO_MANY_TAGS: `Maximum ${PROBLEM_LIMITS.MAX_TAGS} tags allowed`,
  INVALID_TAG: 'Tag contains invalid characters',
  
  // Authorization
  UNAUTHORIZED: 'Not authorized to access this problem',
  ADMIN_ONLY: 'Only administrators can perform this action',
  CREATOR_ONLY: 'Only problem creator can perform this action',
};

module.exports = {
  PROBLEM_DIFFICULTY,
  PROBLEM_LIMITS,
  TEST_CASE_LIMITS,
  PROBLEM_MESSAGES,
};
