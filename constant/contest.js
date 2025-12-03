/**
 * Contest Constants and Messages
 */

// Contest Status
const contestStatus = {
  draft: 'DRAFT',
  scheduled: 'SCHEDULED',
  running: 'RUNNING',
  ended: 'ENDED',
  cancelled: 'CANCELLED',
};

// Contest Type
const contestType = {
  public: 'PUBLIC',
  private: 'PRIVATE',
  college: 'COLLEGE',
};

// Contest Limits
const contestLimits = {
  titleMaxLength: 200,
  descriptionMaxLength: 5000,
  rulesMaxLength: 2000,
  prizesMaxLength: 2000,
  maxProblems: 50,
  maxParticipants: 10000,
  minDuration: 60, // minutes
  maxDuration: 604800, // 7 days in minutes
};

// Contest Messages
const contestMessages = {
  // Success
  created: 'Contest created successfully',
  updated: 'Contest updated successfully',
  deleted: 'Contest deleted successfully',
  published: 'Contest published successfully',
  started: 'Contest started successfully',
  ended: 'Contest ended successfully',
  cancelled: 'Contest cancelled successfully',
  registered: 'Successfully registered for contest',
  unregistered: 'Successfully unregistered from contest',
  problemAdded: 'Problem added to contest successfully',
  problemRemoved: 'Problem removed from contest successfully',
  problemUpdated: 'Contest problem updated successfully',
  
  // Errors
  notFound: 'Contest not found',
  alreadyExists: 'Contest with this slug already exists',
  alreadyStarted: 'Contest has already started',
  notStarted: 'Contest has not started yet',
  alreadyEnded: 'Contest has ended',
  isFull: 'Contest has reached maximum participants',
  registrationClosed: 'Registration deadline has passed',
  alreadyRegistered: 'Already registered for this contest',
  notRegistered: 'Not registered for this contest',
  cannotDeleteStarted: 'Cannot delete a contest that has started',
  cannotModifyStarted: 'Cannot modify contest after it has started',
  problemNotInContest: 'Problem is not part of this contest',
  problemAlreadyInContest: 'Problem already added to this contest',
  
  // Validation
  invalidStatus: 'Invalid contest status',
  invalidType: 'Invalid contest type',
  invalidTimeRange: 'End time must be after start time',
  invalidDuration: 'Contest duration is invalid',
  invalidRegistrationDeadline: 'Registration deadline must be before start time',
  titleRequired: 'Contest title is required',
  descriptionRequired: 'Contest description is required',
  startTimeRequired: 'Start time is required',
  endTimeRequired: 'End time is required',
  durationRequired: 'Duration is required',
  noProblems: 'Contest must have at least one problem',
  
  // Authorization
  unauthorized: 'Not authorized to access this contest',
  adminOnly: 'Only administrators can perform this action',
  creatorOnly: 'Only contest creator can perform this action',
  
  // Service Errors
  fetchContestsFailed: 'Failed to get contests',
  fetchParticipantsFailed: 'Failed to get participants',
  fetchLeaderboardFailed: 'Failed to get leaderboard',
};

export {
  contestStatus,
  contestType,
  contestLimits,
  contestMessages,
};
