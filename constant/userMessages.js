// User Management Messages
export const userMessages = {
  // Success messages
  usersFetchedSuccess: 'Users fetched successfully',
  userFetchedSuccess: 'User details fetched successfully',
  userUpdatedSuccess: 'User updated successfully',
  userDeletedSuccess: 'User deleted successfully',
  userActivatedSuccess: 'User activated successfully',
  userDeactivatedSuccess: 'User deactivated successfully',
  roleUpdatedSuccess: 'User role updated successfully',
  
  // Error messages
  userNotFound: 'User not found',
  cannotDeleteSelf: 'You cannot delete your own account',
  cannotDeactivateSelf: 'You cannot deactivate your own account',
  cannotUpdateOwnRole: 'You cannot update your own role',
  invalidRole: 'Invalid role. Must be USER, ADMIN, or MODERATOR',
  invalidUserId: 'Invalid user ID format',
  
  // Validation messages
  pageMinValue: 'Page must be at least 1',
  limitMinValue: 'Limit must be at least 1',
  limitMaxValue: 'Limit must not exceed 100',
  searchMaxLength: 'Search term must not exceed 100 characters',
  invalidSortBy: 'Invalid sort field',
  invalidSortOrder: 'Sort order must be asc or desc',
  firstNameMinLength: 'First name must be at least 2 characters',
  firstNameMaxLength: 'First name must not exceed 50 characters',
  lastNameMinLength: 'Last name must be at least 2 characters',
  lastNameMaxLength: 'Last name must not exceed 50 characters',
  usernameMinLength: 'Username must be at least 3 characters',
  usernameMaxLength: 'Username must not exceed 30 characters',
  usernameAlphanumeric: 'Username must contain only letters and numbers'
};

// Analytics Messages
export const analyticsMessages = {
  // Success messages
  analyticsFetchedSuccess: 'Analytics data fetched successfully',
  statsFetchedSuccess: 'Statistics fetched successfully',
  
  // Error messages
  analyticsFetchFailed: 'Failed to fetch analytics data',
  
  // Validation messages
  invalidDateFormat: 'Invalid date format. Use ISO 8601 format',
  endDateMustBeAfterStart: 'End date must be after start date'
};

// Submission Messages (Admin)
export const submissionAdminMessages = {
  // Success messages
  submissionsFetchedSuccess: 'Submissions fetched successfully',
  submissionDeletedSuccess: 'Submission deleted successfully',
  submissionRejudgedSuccess: 'Submission queued for rejudge',
  
  // Error messages
  submissionNotFound: 'Submission not found',
  rejudgeFailed: 'Failed to queue submission for rejudge',
  
  // Validation messages
  pageMinValue: 'Page must be at least 1',
  limitMinValue: 'Limit must be at least 1',
  limitMaxValue: 'Limit must not exceed 100',
  invalidUserId: 'Invalid user ID format',
  invalidProblemId: 'Invalid problem ID format',
  invalidStatus: 'Invalid submission status',
  languageMaxLength: 'Language must not exceed 50 characters',
  invalidDateFormat: 'Invalid date format. Use ISO 8601 format',
  endDateMustBeAfterStart: 'End date must be after start date',
  invalidSortBy: 'Invalid sort field',
  invalidSortOrder: 'Sort order must be asc or desc'
};

// Editorial Messages
export const editorialMessages = {
  // Success messages
  editorialCreatedSuccess: 'Editorial created successfully',
  editorialUpdatedSuccess: 'Editorial updated successfully',
  editorialDeletedSuccess: 'Editorial deleted successfully',
  editorialFetchedSuccess: 'Editorial fetched successfully',
  hintCreatedSuccess: 'Hint created successfully',
  hintUpdatedSuccess: 'Hint updated successfully',
  hintDeletedSuccess: 'Hint deleted successfully',
  hintsFetchedSuccess: 'Hints fetched successfully',
  
  // Error messages
  editorialNotFound: 'Editorial not found',
  editorialExists: 'Editorial already exists for this problem',
  hintNotFound: 'Hint not found',
  maxHintsReached: 'Maximum 5 hints allowed per problem',
  hintOrderInvalid: 'Hint order must be between 1 and 5',
  
  // Validation messages
  titleRequired: 'Editorial title is required',
  titleMinLength: 'Title must be at least 5 characters',
  titleMaxLength: 'Title must not exceed 200 characters',
  contentRequired: 'Editorial content is required',
  contentMinLength: 'Content must be at least 10 characters',
  approachMinLength: 'Approach must be at least 10 characters',
  approachMaxLength: 'Approach must not exceed 5000 characters',
  complexityMaxLength: 'Complexity description must not exceed 500 characters',
  codeLanguageRequired: 'Code example language is required',
  codeRequired: 'Code example code is required',
  atLeastOneField: 'At least one field must be provided for update',
  hintContentRequired: 'Hint content is required',
  hintContentMinLength: 'Hint content must be at least 10 characters',
  hintContentMaxLength: 'Hint content must not exceed 1000 characters',
  hintOrderRequired: 'Hint order is required',
  hintOrderMin: 'Hint order must be at least 1',
  hintOrderMax: 'Hint order must not exceed 5',
  penaltyMin: 'Penalty must be at least 0',
  penaltyMax: 'Penalty must not exceed 100'
};

// Contest Clone Messages
export const contestCloneMessages = {
  // Success messages
  contestClonedSuccess: 'Contest cloned successfully',
  
  // Error messages
  contestNotFound: 'Source contest not found',
  cloneSlugExists: 'Contest with this slug already exists',
  cloneFailed: 'Failed to clone contest'
};
