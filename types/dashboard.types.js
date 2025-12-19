/**
 * @fileoverview JSDoc Type Definitions for Dashboard API
 * Contains all request/response type definitions for admin dashboard endpoints
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * @typedef {Object} PaginationParams
 * @property {number} [page=1] - Page number (1-based)
 * @property {number} [limit=20] - Items per page (max 100)
 * @property {string} [sortBy] - Field to sort by
 * @property {'asc'|'desc'} [sortOrder='desc'] - Sort order
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 * @property {number} total - Total number of items
 * @property {number} totalPages - Total number of pages
 */

/**
 * @typedef {Object} DateRangeParams
 * @property {string} [startDate] - Start date in ISO 8601 format
 * @property {string} [endDate] - End date in ISO 8601 format
 */

// ============================================================================
// USER MANAGEMENT TYPES
// ============================================================================

/**
 * @typedef {'USER'|'ADMIN'|'MODERATOR'} UserRole
 */

/**
 * @typedef {Object} GetUsersParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=20] - Items per page (max 100)
 * @property {UserRole} [role] - Filter by role
 * @property {'true'|'false'} [isActive] - Filter by active status
 * @property {string} [search] - Search term for email, username, or name
 * @property {'createdAt'|'email'|'username'|'firstName'|'lastName'|'lastLoginAt'} [sortBy] - Sort field
 * @property {'asc'|'desc'} [sortOrder] - Sort order
 */

/**
 * @typedef {Object} UserSummary
 * @property {string} id - User ID (UUID)
 * @property {string} email - User email
 * @property {string} [username] - Username
 * @property {string} [phone] - Phone number
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 * @property {string} [avatar] - Avatar URL
 * @property {'LOCAL'|'GOOGLE'|'PHONE'} provider - Auth provider
 * @property {UserRole} role - User role
 * @property {boolean} isActive - Whether user is active
 * @property {boolean} isVerified - Whether user is verified
 * @property {string} [lastLoginAt] - Last login timestamp
 * @property {string} createdAt - Account creation timestamp
 */

/**
 * @typedef {Object} UserWithStats
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} [username] - Username
 * @property {string} [phone] - Phone number
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 * @property {string} [avatar] - Avatar URL
 * @property {'LOCAL'|'GOOGLE'|'PHONE'} provider - Auth provider
 * @property {UserRole} role - User role
 * @property {boolean} isActive - Whether user is active
 * @property {boolean} isVerified - Whether user is verified
 * @property {string} [lastLoginAt] - Last login timestamp
 * @property {string} createdAt - Account creation timestamp
 * @property {string} [updatedAt] - Last update timestamp
 * @property {Object} _count - Aggregated counts
 * @property {number} _count.submissions - Total submissions
 * @property {number} _count.contestParticipations - Contest participations
 */

/**
 * @typedef {Object} GetUsersResponse
 * @property {UserWithStats[]} users - Array of users
 * @property {number} total - Total user count
 * @property {number} page - Current page
 * @property {number} totalPages - Total pages
 */

/**
 * @typedef {Object} UpdateUserParams
 * @property {string} [firstName] - First name (2-50 chars)
 * @property {string} [lastName] - Last name (2-50 chars)
 * @property {string} [username] - Username (3-30 chars, alphanumeric)
 * @property {boolean} [isVerified] - Verification status
 */

/**
 * @typedef {Object} UpdateUserRoleParams
 * @property {UserRole} role - New role
 */

// ============================================================================
// CONTEST MANAGEMENT TYPES
// ============================================================================

/**
 * @typedef {'DRAFT'|'SCHEDULED'|'RUNNING'|'ENDED'|'CANCELLED'} ContestStatus
 */

/**
 * @typedef {'PUBLIC'|'PRIVATE'|'COLLEGE'} ContestType
 */

/**
 * @typedef {Object} GetContestsParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=20] - Items per page
 * @property {ContestStatus} [status] - Filter by status
 * @property {ContestType} [type] - Filter by type
 * @property {string} [search] - Search term
 * @property {'createdAt'|'startTime'|'endTime'|'title'} [sortBy] - Sort field
 * @property {'asc'|'desc'} [sortOrder] - Sort order
 */

/**
 * @typedef {Object} CreateContestParams
 * @property {string} title - Contest title (max 200 chars)
 * @property {string} slug - URL-friendly slug
 * @property {string} description - Contest description
 * @property {string} [rules] - Contest rules
 * @property {string} [prizes] - Prize information
 * @property {ContestType} type - Contest type
 * @property {string} startTime - Start time (ISO 8601)
 * @property {string} endTime - End time (ISO 8601)
 * @property {number} duration - Duration in minutes
 * @property {string} [registrationDeadline] - Registration deadline
 * @property {number} [maxParticipants] - Max participants (default 10000)
 * @property {boolean} [isRated=false] - Whether contest is rated
 */

/**
 * @typedef {Object} UpdateContestParams
 * @property {string} [title] - Contest title
 * @property {string} [description] - Contest description
 * @property {string} [rules] - Contest rules
 * @property {string} [prizes] - Prize information
 * @property {ContestType} [type] - Contest type
 * @property {string} [startTime] - Start time
 * @property {string} [endTime] - End time
 * @property {number} [duration] - Duration in minutes
 * @property {string} [registrationDeadline] - Registration deadline
 * @property {number} [maxParticipants] - Max participants
 * @property {boolean} [isRated] - Whether contest is rated
 */

/**
 * @typedef {Object} ContestSummary
 * @property {string} id - Contest ID
 * @property {string} title - Contest title
 * @property {string} slug - URL slug
 * @property {string} description - Description
 * @property {ContestStatus} status - Contest status
 * @property {ContestType} type - Contest type
 * @property {string} startTime - Start time
 * @property {string} endTime - End time
 * @property {number} duration - Duration in minutes
 * @property {string} createdAt - Creation timestamp
 * @property {Object} _count - Counts
 * @property {number} _count.participants - Participant count
 * @property {number} _count.problems - Problem count
 */

/**
 * @typedef {Object} GetContestsResponse
 * @property {ContestSummary[]} contests - Array of contests
 * @property {PaginationMeta} pagination - Pagination metadata
 */

/**
 * @typedef {Object} AddProblemToContestParams
 * @property {string} problemId - Problem ID to add
 * @property {number} [orderIndex] - Display order (0-based)
 * @property {number} [points=100] - Points for the problem
 * @property {number} [bonusPoints=0] - Bonus points for early solve
 */

/**
 * @typedef {Object} UpdateContestStatusParams
 * @property {ContestStatus} status - New status
 */

/**
 * @typedef {Object} ContestParticipant
 * @property {string} id - Participation ID
 * @property {string} contestId - Contest ID
 * @property {string} userId - User ID
 * @property {number} totalScore - Total score
 * @property {string} [lastSubmissionTime] - Last submission time
 * @property {string} registeredAt - Registration timestamp
 * @property {UserSummary} user - User details
 */

/**
 * @typedef {Object} GetParticipantsResponse
 * @property {ContestParticipant[]} participants - Participants list
 * @property {PaginationMeta} pagination - Pagination metadata
 */

// ============================================================================
// PROBLEM MANAGEMENT TYPES
// ============================================================================

/**
 * @typedef {'EASY'|'MEDIUM'|'HARD'} ProblemDifficulty
 */

/**
 * @typedef {Object} GetProblemsParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=20] - Items per page
 * @property {ProblemDifficulty} [difficulty] - Filter by difficulty
 * @property {string} [tags] - Comma-separated tags
 * @property {string} [search] - Search term
 * @property {boolean} [isPublic] - Filter by public status
 * @property {'createdAt'|'title'|'difficulty'} [sortBy] - Sort field
 * @property {'asc'|'desc'} [sortOrder] - Sort order
 */

/**
 * @typedef {Object} CreateProblemParams
 * @property {string} title - Problem title (max 200 chars)
 * @property {string} slug - URL-friendly slug
 * @property {string} statement - Problem statement (max 10000 chars)
 * @property {ProblemDifficulty} difficulty - Difficulty level
 * @property {string} [inputFormat] - Input format description
 * @property {string} [outputFormat] - Output format description
 * @property {string} [constraints] - Constraints description
 * @property {string[]} [tags] - Problem tags (max 10)
 * @property {number} [timeLimit=1000] - Time limit in ms (100-10000)
 * @property {number} [memoryLimit=262144] - Memory limit in KB (32768-524288)
 * @property {number} [sourceLimit=50000] - Source code limit in bytes
 * @property {boolean} [isPublic=false] - Whether problem is public
 */

/**
 * @typedef {Object} UpdateProblemParams
 * @property {string} [title] - Problem title
 * @property {string} [statement] - Problem statement
 * @property {ProblemDifficulty} [difficulty] - Difficulty level
 * @property {string} [inputFormat] - Input format
 * @property {string} [outputFormat] - Output format
 * @property {string} [constraints] - Constraints
 * @property {string[]} [tags] - Problem tags
 * @property {number} [timeLimit] - Time limit in ms
 * @property {number} [memoryLimit] - Memory limit in KB
 * @property {number} [sourceLimit] - Source code limit
 * @property {boolean} [isPublic] - Public status
 */

/**
 * @typedef {Object} ProblemSummary
 * @property {string} id - Problem ID
 * @property {string} title - Problem title
 * @property {string} slug - URL slug
 * @property {ProblemDifficulty} difficulty - Difficulty level
 * @property {string[]} tags - Problem tags
 * @property {boolean} isPublic - Whether public
 * @property {string} createdAt - Creation timestamp
 * @property {Object} _count - Counts
 * @property {number} _count.submissions - Submission count
 * @property {number} _count.testCases - Test case count
 */

/**
 * @typedef {Object} GetProblemsResponse
 * @property {ProblemSummary[]} problems - Array of problems
 * @property {PaginationMeta} pagination - Pagination metadata
 */

/**
 * @typedef {Object} CreateTestCaseParams
 * @property {string} input - Test input (max 1MB)
 * @property {string} expectedOutput - Expected output (max 1MB)
 * @property {number} [orderIndex] - Display order
 * @property {boolean} [isSample=false] - Whether shown as sample
 * @property {boolean} [isHidden=true] - Whether hidden from users
 * @property {number} [points=10] - Points for this test case
 * @property {string} [explanation] - Explanation for sample cases
 */

/**
 * @typedef {Object} UpdateTestCaseParams
 * @property {string} [input] - Test input
 * @property {string} [expectedOutput] - Expected output
 * @property {number} [orderIndex] - Display order
 * @property {boolean} [isSample] - Sample flag
 * @property {boolean} [isHidden] - Hidden flag
 * @property {number} [points] - Points
 * @property {string} [explanation] - Explanation
 */

/**
 * @typedef {Object} TestCase
 * @property {string} id - Test case ID
 * @property {string} problemId - Problem ID
 * @property {string} input - Test input
 * @property {string} expectedOutput - Expected output
 * @property {number} orderIndex - Display order
 * @property {boolean} isSample - Whether sample
 * @property {boolean} isHidden - Whether hidden
 * @property {number} points - Points value
 * @property {string} [explanation] - Explanation
 */

// ============================================================================
// SUBMISSION ADMIN TYPES
// ============================================================================

/**
 * @typedef {'QUEUED'|'RUNNING'|'COMPILE_ERROR'|'WRONG_ANSWER'|'TIME_LIMIT_EXCEEDED'|'RUNTIME_ERROR'|'MEMORY_LIMIT_EXCEEDED'|'ACCEPTED'|'PARTIAL'|'FAILED'} SubmissionStatus
 */

/**
 * @typedef {Object} GetSubmissionsParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=20] - Items per page (max 100)
 * @property {string} [userId] - Filter by user ID (UUID)
 * @property {string} [problemId] - Filter by problem ID (UUID)
 * @property {SubmissionStatus} [status] - Filter by status
 * @property {string} [language] - Filter by language
 * @property {string} [startDate] - Start date (ISO 8601)
 * @property {string} [endDate] - End date (ISO 8601)
 * @property {'createdAt'|'status'|'language'|'time'|'memory'|'score'} [sortBy] - Sort field
 * @property {'asc'|'desc'} [sortOrder] - Sort order
 */

/**
 * @typedef {Object} SubmissionUserInfo
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} [username] - Username
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 */

/**
 * @typedef {Object} SubmissionProblemInfo
 * @property {string} id - Problem ID
 * @property {string} title - Problem title
 * @property {string} slug - Problem slug
 * @property {ProblemDifficulty} difficulty - Difficulty
 */

/**
 * @typedef {Object} SubmissionDetail
 * @property {string} id - Submission ID
 * @property {string} userId - User ID
 * @property {string} problemId - Problem ID
 * @property {string} [contestId] - Contest ID if part of contest
 * @property {string} code - Submitted code
 * @property {string} language - Programming language
 * @property {SubmissionStatus} status - Current status
 * @property {number} [time] - Execution time in ms
 * @property {number} [memory] - Memory used in KB
 * @property {number} [score] - Score achieved
 * @property {string} [errorMessage] - Error message if failed
 * @property {string} createdAt - Submission timestamp
 * @property {string} [judgedAt] - Judging completion timestamp
 * @property {SubmissionUserInfo} user - User info
 * @property {SubmissionProblemInfo} problem - Problem info
 */

/**
 * @typedef {Object} GetSubmissionsResponse
 * @property {SubmissionDetail[]} submissions - Submissions list
 * @property {number} total - Total count
 * @property {number} page - Current page
 * @property {number} totalPages - Total pages
 */

// ============================================================================
// EDITORIAL TYPES
// ============================================================================

/**
 * @typedef {Object} CodeExample
 * @property {string} language - Programming language
 * @property {string} code - Code snippet
 * @property {string} [explanation] - Code explanation
 */

/**
 * @typedef {Object} CreateEditorialParams
 * @property {string} title - Editorial title (5-200 chars)
 * @property {string} content - Editorial content (min 10 chars)
 * @property {string} [approach] - Solution approach (10-5000 chars)
 * @property {string} [complexity] - Time/space complexity (max 500 chars)
 * @property {CodeExample[]} [codeExamples] - Code examples
 * @property {string[]} [relatedTopics] - Related topic tags
 * @property {boolean} [isPublished=false] - Publication status
 */

/**
 * @typedef {Object} UpdateEditorialParams
 * @property {string} [title] - Editorial title
 * @property {string} [content] - Editorial content
 * @property {string} [approach] - Solution approach
 * @property {string} [complexity] - Complexity description
 * @property {CodeExample[]} [codeExamples] - Code examples
 * @property {string[]} [relatedTopics] - Related topics
 * @property {boolean} [isPublished] - Publication status
 */

/**
 * @typedef {Object} Hint
 * @property {string} id - Hint ID
 * @property {string} editorialId - Editorial ID
 * @property {string} content - Hint content
 * @property {number} orderIndex - Display order (1-5)
 * @property {number} penalty - Point penalty for viewing
 * @property {string} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} CreateHintParams
 * @property {string} content - Hint content (10-1000 chars)
 * @property {number} orderIndex - Display order (1-5)
 * @property {number} [penalty=0] - Point penalty (0-100)
 */

/**
 * @typedef {Object} UpdateHintParams
 * @property {string} [content] - Hint content
 * @property {number} [orderIndex] - Display order
 * @property {number} [penalty] - Point penalty
 */

/**
 * @typedef {Object} Editorial
 * @property {string} id - Editorial ID
 * @property {string} problemId - Problem ID
 * @property {string} title - Title
 * @property {string} content - Content
 * @property {string} [approach] - Solution approach
 * @property {string} [complexity] - Complexity analysis
 * @property {CodeExample[]} [codeExamples] - Code examples
 * @property {string[]} [relatedTopics] - Related topics
 * @property {boolean} isPublished - Publication status
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {Hint[]} hints - Associated hints
 * @property {ProblemSummary} [problem] - Problem details
 */

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * @typedef {Object} GetSubmissionStatsParams
 * @property {string} [startDate] - Start date (ISO 8601)
 * @property {string} [endDate] - End date (ISO 8601)
 */

/**
 * @typedef {Object} DashboardStats
 * @property {Object} users - User statistics
 * @property {number} users.total - Total users
 * @property {number} users.active - Active users
 * @property {Object} problems - Problem statistics
 * @property {number} problems.total - Total problems
 * @property {number} problems.published - Published problems
 * @property {Object} contests - Contest statistics
 * @property {number} contests.total - Total contests
 * @property {number} contests.active - Running contests
 * @property {Object} submissions - Submission statistics
 * @property {number} submissions.total - Total submissions
 * @property {number} submissions.today - Today's submissions
 * @property {UserSummary[]} recentUsers - Recently registered users
 * @property {ProblemSummary[]} popularProblems - Most submitted problems
 * @property {ContestSummary[]} upcomingContests - Upcoming contests
 */

/**
 * @typedef {Object} StatusDistribution
 * @property {SubmissionStatus} status - Submission status
 * @property {number} _count - Count of submissions with this status
 */

/**
 * @typedef {Object} LanguageDistribution
 * @property {string} language - Programming language
 * @property {number} _count - Count of submissions with this language
 */

/**
 * @typedef {Object} SubmissionStats
 * @property {number} totalSubmissions - Total submissions in range
 * @property {StatusDistribution[]} statusDistribution - Status breakdown
 * @property {LanguageDistribution[]} languageDistribution - Language breakdown
 */

/**
 * @typedef {Object} UserStats
 * @property {number} totalUsers - Total users
 * @property {number} activeUsers - Active users
 * @property {number} verifiedUsers - Verified users
 * @property {Object.<string, number>} roleDistribution - Users by role
 */

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * @typedef {Object} ApiSuccessResponse
 * @property {'success'} status - Response status
 * @property {string} message - Success message
 * @property {*} [data] - Response data
 */

/**
 * @typedef {Object} ApiErrorResponse
 * @property {'error'} status - Response status
 * @property {string} message - Error message
 * @property {Object[]} [errors] - Validation errors
 */

export const DashboardTypes = {};
