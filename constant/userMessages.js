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
  invalidUserId: 'Invalid user ID format'
};

// Analytics Messages
export const analyticsMessages = {
  // Success messages
  analyticsFetchedSuccess: 'Analytics data fetched successfully',
  statsFetchedSuccess: 'Statistics fetched successfully',
  
  // Error messages
  analyticsFetchFailed: 'Failed to fetch analytics data'
};

// Submission Messages (Admin)
export const submissionAdminMessages = {
  // Success messages
  submissionsFetchedSuccess: 'Submissions fetched successfully',
  submissionDeletedSuccess: 'Submission deleted successfully',
  submissionRejudgedSuccess: 'Submission queued for rejudge',
  
  // Error messages
  submissionNotFound: 'Submission not found',
  rejudgeFailed: 'Failed to queue submission for rejudge'
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
  hintOrderInvalid: 'Hint order must be between 1 and 5'
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
