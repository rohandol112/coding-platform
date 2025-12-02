/**
 * Contest Constants and Messages
 */

// Contest Status
const CONTEST_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  RUNNING: 'RUNNING',
  ENDED: 'ENDED',
  CANCELLED: 'CANCELLED',
};

// Contest Types
const CONTEST_TYPE = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  COLLEGE: 'COLLEGE',
};

// Contest Limits
const CONTEST_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 5000,
  RULES_MAX_LENGTH: 2000,
  PRIZES_MAX_LENGTH: 2000,
  MAX_PROBLEMS: 50,
  MAX_PARTICIPANTS: 10000,
  MIN_DURATION: 60, // minutes
  MAX_DURATION: 604800, // 7 days in minutes
};

// Contest Messages
const CONTEST_MESSAGES = {
  // Success
  CREATED: 'Contest created successfully',
  UPDATED: 'Contest updated successfully',
  DELETED: 'Contest deleted successfully',
  PUBLISHED: 'Contest published successfully',
  STARTED: 'Contest started successfully',
  ENDED: 'Contest ended successfully',
  CANCELLED: 'Contest cancelled successfully',
  REGISTERED: 'Successfully registered for contest',
  UNREGISTERED: 'Successfully unregistered from contest',
  PROBLEM_ADDED: 'Problem added to contest successfully',
  PROBLEM_REMOVED: 'Problem removed from contest successfully',
  PROBLEM_UPDATED: 'Contest problem updated successfully',
  
  // Errors
  NOT_FOUND: 'Contest not found',
  ALREADY_EXISTS: 'Contest with this slug already exists',
  ALREADY_STARTED: 'Contest has already started',
  NOT_STARTED: 'Contest has not started yet',
  ALREADY_ENDED: 'Contest has ended',
  IS_FULL: 'Contest has reached maximum participants',
  REGISTRATION_CLOSED: 'Registration deadline has passed',
  ALREADY_REGISTERED: 'Already registered for this contest',
  NOT_REGISTERED: 'Not registered for this contest',
  CANNOT_DELETE_STARTED: 'Cannot delete a contest that has started',
  CANNOT_MODIFY_STARTED: 'Cannot modify contest after it has started',
  PROBLEM_NOT_IN_CONTEST: 'Problem is not part of this contest',
  PROBLEM_ALREADY_IN_CONTEST: 'Problem already added to this contest',
  
  // Validation
  INVALID_STATUS: 'Invalid contest status',
  INVALID_TYPE: 'Invalid contest type',
  INVALID_TIME_RANGE: 'End time must be after start time',
  INVALID_DURATION: 'Contest duration is invalid',
  INVALID_REGISTRATION_DEADLINE: 'Registration deadline must be before start time',
  TITLE_REQUIRED: 'Contest title is required',
  DESCRIPTION_REQUIRED: 'Contest description is required',
  START_TIME_REQUIRED: 'Start time is required',
  END_TIME_REQUIRED: 'End time is required',
  DURATION_REQUIRED: 'Duration is required',
  NO_PROBLEMS: 'Contest must have at least one problem',
  
  // Authorization
  UNAUTHORIZED: 'Not authorized to access this contest',
  ADMIN_ONLY: 'Only administrators can perform this action',
  CREATOR_ONLY: 'Only contest creator can perform this action',
};

module.exports = {
  CONTEST_STATUS,
  CONTEST_TYPE,
  CONTEST_LIMITS,
  CONTEST_MESSAGES,
};
