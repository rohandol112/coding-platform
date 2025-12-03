/**
 * Problem Constants and Messages
 */

// Problem Difficulty Levels
const problemDifficulty = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
};

// Problem Limits
const problemLimits = {
  titleMaxLength: 200,
  slugMaxLength: 200,
  statementMaxLength: 10000,
  inputFormatMaxLength: 2000,
  outputFormatMaxLength: 2000,
  constraintsMaxLength: 2000,
  hintsMaxLength: 3000,
  solutionApproachMaxLength: 5000,
  maxTags: 10,
  tagMaxLength: 50,
  maxTestCases: 100,
  defaultTimeLimit: 1000, // ms
  minTimeLimit: 100, // ms
  maxTimeLimit: 10000, // ms
  defaultMemoryLimit: 262144, // KB (256 MB)
  minMemoryLimit: 32768, // KB (32 MB)
  maxMemoryLimit: 524288, // KB (512 MB)
  defaultSourceLimit: 50000, // bytes (50 KB)
  minSourceLimit: 1024, // bytes (1 KB)
  maxSourceLimit: 100000, // bytes (100 KB)
};

// Test Case Limits
const testCaseLimits = {
  inputMaxSize: 1048576, // 1 MB
  outputMaxSize: 1048576, // 1 MB
  explanationMaxLength: 1000,
  minPoints: 0,
  maxPoints: 100,
  defaultPoints: 10,
};

// Problem Messages
const problemMessages = {
  // Success
  created: 'Problem created successfully',
  updated: 'Problem updated successfully',
  deleted: 'Problem deleted successfully',
  published: 'Problem published successfully',
  unpublished: 'Problem unpublished successfully',
  
  // Test Case Messages
  testCaseAdded: 'Test case added successfully',
  testCaseUpdated: 'Test case updated successfully',
  testCaseDeleted: 'Test case deleted successfully',
  testCaseNotFound: 'Test case not found',
  
  // Errors
  notFound: 'Problem not found',
  slugExists: 'Problem with this slug already exists',
  usedInContest: 'Cannot delete problem as it is used in active contests',
  noTestCases: 'Problem must have at least one test case',
  
  // Validation
  titleRequired: 'Problem title is required',
  slugRequired: 'Problem slug is required',
  statementRequired: 'Problem statement is required',
  difficultyRequired: 'Problem difficulty is required',
  invalidDifficulty: 'Invalid problem difficulty',
  invalidTimeLimit: 'Invalid time limit',
  invalidMemoryLimit: 'Invalid memory limit',
  invalidSourceLimit: 'Invalid source limit',
  tooManyTags: `Maximum ${problemLimits.maxTags} tags allowed`,
  invalidTag: 'Tag contains invalid characters',
  
  // Authorization
  unauthorized: 'Not authorized to access this problem',
  adminOnly: 'Only administrators can perform this action',
  creatorOnly: 'Only problem creator can perform this action',
  
  // Service Errors
  fetchProblemsFailed: 'Failed to get problems',
  fetchTestCasesFailed: 'Failed to get test cases',
};

export {
  problemDifficulty,
  problemLimits,
  testCaseLimits,
  problemMessages,
};
