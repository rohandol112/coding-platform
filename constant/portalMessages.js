/**
 * @fileoverview Portal Messages - All user-facing messages for portal endpoints
 */

// Problem Messages
export const problemMessages = {
  // Success messages
  problemsFetchedSuccess: 'Problems fetched successfully',
  problemFetchedSuccess: 'Problem fetched successfully',
  tagsFetchedSuccess: 'Tags fetched successfully',
  solvedProblemsFetchedSuccess: 'Solved problems fetched successfully',
  
  // Error messages
  problemNotFound: 'Problem not found',
  problemNotPublic: 'This problem is not available',
  
  // Validation messages
  slugRequired: 'Problem slug is required',
  invalidDifficulty: 'Difficulty must be EASY, MEDIUM, or HARD',
  invalidSortBy: 'Invalid sort field',
  invalidSortOrder: 'Sort order must be asc or desc',
  pageMinValue: 'Page must be at least 1',
  limitMinValue: 'Limit must be at least 1',
  limitMaxValue: 'Limit cannot exceed 100',
  searchMaxLength: 'Search query cannot exceed 100 characters',
};

// Contest Messages
export const contestMessages = {
  // Success messages
  contestsFetchedSuccess: 'Contests fetched successfully',
  contestFetchedSuccess: 'Contest fetched successfully',
  registrationSuccess: 'Successfully registered for contest',
  unregistrationSuccess: 'Successfully unregistered from contest',
  leaderboardFetchedSuccess: 'Leaderboard fetched successfully',
  upcomingContestsFetchedSuccess: 'Upcoming contests fetched successfully',
  runningContestsFetchedSuccess: 'Running contests fetched successfully',
  myContestsFetchedSuccess: 'Your contests fetched successfully',
  
  // Error messages
  contestNotFound: 'Contest not found',
  contestNotPublic: 'This contest is not open for registration',
  registrationClosed: 'Registration deadline has passed',
  contestEnded: 'Cannot register for an ended or cancelled contest',
  contestFull: 'Contest is full',
  alreadyRegistered: 'You are already registered for this contest',
  notRegistered: 'You are not registered for this contest',
  contestStarted: 'Cannot unregister after contest has started',
  contestNotRunning: 'Contest is not currently running',
  contestNotActive: 'Contest is not active',
  mustRegisterFirst: 'You must register for the contest first',
  problemNotInContest: 'Problem is not part of this contest',
  
  // Validation messages
  contestIdRequired: 'Contest ID is required',
  contestIdInvalid: 'Contest ID must be a valid UUID',
  slugRequired: 'Contest slug is required',
  invalidStatus: 'Invalid contest status',
  invalidType: 'Invalid contest type',
  leaderboardLimitMax: 'Leaderboard limit cannot exceed 200',
};

// Submission Messages
export const submissionMessages = {
  // Success messages
  submissionCreatedSuccess: 'Submission created successfully',
  submissionFetchedSuccess: 'Submission fetched successfully',
  submissionsFetchedSuccess: 'Submissions fetched successfully',
  statsFetchedSuccess: 'Statistics fetched successfully',
  bestSubmissionFetchedSuccess: 'Best submission fetched successfully',
  codeExecutionQueued: 'Code execution queued',
  
  // Error messages
  submissionNotFound: 'Submission not found',
  noSubmissionsFound: 'No submissions found for this problem',
  rateLimitExceeded: 'Submission rate limit exceeded',
  codeSizeExceeded: 'Source code exceeds size limit',
  problemNotFound: 'Problem not found',
  problemNotPublic: 'This problem is not available for practice',
  
  // Validation messages
  problemIdRequired: 'Problem ID is required',
  problemIdInvalid: 'Problem ID must be a valid UUID',
  languageRequired: 'Language is required',
  languageInvalid: 'Unsupported programming language',
  codeRequired: 'Source code is required',
  codeEmpty: 'Source code cannot be empty',
  codeMaxSize: 'Source code exceeds maximum size of 64 KB',
  stdinMaxSize: 'Input exceeds maximum size of 10 KB',
  submissionIdRequired: 'Submission ID is required',
  submissionIdInvalid: 'Submission ID must be a valid UUID',
  invalidStatus: 'Invalid submission status',
  validationFailed: 'Validation failed',
};

// User Messages
export const userProfileMessages = {
  // Success messages
  profileFetchedSuccess: 'Profile fetched successfully',
  profileUpdatedSuccess: 'Profile updated successfully',
  activityFetchedSuccess: 'Activity calendar fetched successfully',
  rankFetchedSuccess: 'Rank fetched successfully',
  leaderboardFetchedSuccess: 'Leaderboard fetched successfully',
  
  // Error messages
  userNotFound: 'User not found',
  
  // Validation messages
  usernameRequired: 'Username is required',
  usernameMinLength: 'Username must be at least 3 characters',
  usernameMaxLength: 'Username must not exceed 30 characters',
  firstNameEmpty: 'First name cannot be empty',
  firstNameMaxLength: 'First name must not exceed 50 characters',
  lastNameEmpty: 'Last name cannot be empty',
  lastNameMaxLength: 'Last name must not exceed 50 characters',
  avatarInvalidUrl: 'Avatar must be a valid URL',
  invalidTimeframe: 'Timeframe must be ALL_TIME, MONTHLY, or WEEKLY',
  monthsMinValue: 'Months must be at least 1',
  monthsMaxValue: 'Months cannot exceed 24',
};

// Editorial Messages
export const editorialPortalMessages = {
  // Success messages
  editorialFetchedSuccess: 'Editorial fetched successfully',
  hintsFetchedSuccess: 'Hints fetched successfully',
  hintUnlockedSuccess: 'Hint unlocked successfully',
  
  // Error messages
  editorialNotFound: 'Editorial not found',
  editorialNotPublished: 'Editorial is not available',
  hintNotFound: 'Hint not found',
  hintNotAvailable: 'Hint is not available',
};

// General Portal Messages
export const portalMessages = {
  authRequired: 'Authentication required',
  internalError: 'An error occurred. Please try again later.',
};

export default {
  problemMessages,
  contestMessages,
  submissionMessages,
  userProfileMessages,
  editorialPortalMessages,
  portalMessages,
};
