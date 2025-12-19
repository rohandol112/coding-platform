/**
 * @fileoverview Type definitions for Portal API request/response parameters
 * JSDoc-based type definitions for better IDE support and documentation
 */

// =====================
// Common Types
// =====================

/**
 * @typedef {Object} PaginationParams
 * @property {number} [page=1] - Page number (1-indexed)
 * @property {number} [limit=20] - Items per page (max varies by endpoint)
 */

/**
 * @typedef {Object} PaginationResponse
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 * @property {number} total - Total items count
 * @property {number} totalPages - Total pages count
 */

/**
 * @typedef {'asc' | 'desc'} SortOrder
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - Human-readable message
 * @property {*} [data] - Response data (varies by endpoint)
 * @property {string} [error] - Error details (development mode only)
 */

// =====================
// Problem Types
// =====================

/**
 * @typedef {'EASY' | 'MEDIUM' | 'HARD'} ProblemDifficulty
 */

/**
 * @typedef {'createdAt' | 'title' | 'difficulty'} ProblemSortBy
 */

/**
 * Problem list request parameters
 * @typedef {Object} GetProblemListParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=20] - Items per page (max 100)
 * @property {ProblemDifficulty} [difficulty] - Filter by difficulty
 * @property {string} [tags] - Comma-separated tags to filter by
 * @property {string} [search] - Search in title/description (max 100 chars)
 * @property {ProblemSortBy} [sortBy='createdAt'] - Sort field
 * @property {SortOrder} [sortOrder='desc'] - Sort direction
 */

/**
 * Problem summary in list view
 * @typedef {Object} ProblemListItem
 * @property {string} id - Problem UUID
 * @property {string} title - Problem title
 * @property {string} slug - URL-friendly slug
 * @property {ProblemDifficulty} difficulty - Difficulty level
 * @property {string[]} tags - Problem tags
 * @property {number} timeLimit - Time limit in ms
 * @property {number} memoryLimit - Memory limit in bytes
 * @property {Date} createdAt - Creation timestamp
 * @property {number} totalSubmissions - Total submission count
 * @property {number} acceptedCount - Accepted submission count
 * @property {number} acceptanceRate - Acceptance rate percentage
 * @property {boolean} [isSolved] - Whether current user solved it (if authenticated)
 */

/**
 * Problem list response
 * @typedef {Object} GetProblemListResponse
 * @property {ProblemListItem[]} problems - List of problems
 * @property {PaginationResponse} pagination - Pagination info
 */

/**
 * Problem detail response
 * @typedef {Object} ProblemDetail
 * @property {string} id - Problem UUID
 * @property {string} title - Problem title
 * @property {string} slug - URL-friendly slug
 * @property {string} description - Problem description (markdown)
 * @property {string} inputFormat - Input format description
 * @property {string} outputFormat - Output format description
 * @property {string} [constraints] - Problem constraints
 * @property {ProblemDifficulty} difficulty - Difficulty level
 * @property {string[]} tags - Problem tags
 * @property {number} timeLimit - Time limit in ms
 * @property {number} memoryLimit - Memory limit in bytes
 * @property {number} sourceLimit - Source code size limit in bytes
 * @property {TestCase[]} testCases - Sample test cases (non-hidden)
 * @property {Date} createdAt - Creation timestamp
 * @property {boolean} [isSolved] - Whether current user solved it
 * @property {SubmissionSummary} [bestSubmission] - User's best submission
 */

/**
 * Test case
 * @typedef {Object} TestCase
 * @property {string} id - Test case UUID
 * @property {string} input - Test input
 * @property {string} expectedOutput - Expected output
 * @property {string} [explanation] - Optional explanation
 * @property {number} orderIndex - Order in list
 */

/**
 * Popular tag
 * @typedef {Object} PopularTag
 * @property {string} name - Tag name
 * @property {number} count - Number of problems with this tag
 */

// =====================
// Contest Types
// =====================

/**
 * @typedef {'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'ENDED' | 'CANCELLED'} ContestStatus
 */

/**
 * @typedef {'PUBLIC' | 'PRIVATE' | 'COLLEGE'} ContestType
 */

/**
 * @typedef {'startTime' | 'endTime' | 'createdAt' | 'title'} ContestSortBy
 */

/**
 * Contest list request parameters
 * @typedef {Object} GetContestListParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=20] - Items per page (max 100)
 * @property {ContestStatus} [status] - Filter by status
 * @property {ContestType} [type] - Filter by type
 * @property {string} [search] - Search in title (max 100 chars)
 * @property {ContestSortBy} [sortBy='startTime'] - Sort field
 * @property {SortOrder} [sortOrder='desc'] - Sort direction
 */

/**
 * Contest summary in list view
 * @typedef {Object} ContestListItem
 * @property {string} id - Contest UUID
 * @property {string} title - Contest title
 * @property {string} slug - URL-friendly slug
 * @property {ContestStatus} status - Current status
 * @property {ContestType} type - Contest type
 * @property {Date} startTime - Start timestamp
 * @property {Date} endTime - End timestamp
 * @property {number} duration - Duration in minutes
 * @property {number} participantCount - Number of participants
 * @property {boolean} [isRegistered] - Whether current user is registered
 */

/**
 * Contest list response
 * @typedef {Object} GetContestListResponse
 * @property {ContestListItem[]} contests - List of contests
 * @property {PaginationResponse} pagination - Pagination info
 */

/**
 * Contest detail response
 * @typedef {Object} ContestDetail
 * @property {string} id - Contest UUID
 * @property {string} title - Contest title
 * @property {string} slug - URL-friendly slug
 * @property {string} description - Contest description (markdown)
 * @property {string} [rules] - Contest rules
 * @property {ContestStatus} status - Current status
 * @property {ContestType} type - Contest type
 * @property {Date} startTime - Start timestamp
 * @property {Date} endTime - End timestamp
 * @property {number} duration - Duration in minutes
 * @property {Date} [registrationDeadline] - Registration deadline
 * @property {number} [maxParticipants] - Max allowed participants
 * @property {number} participantCount - Current participant count
 * @property {boolean} [isRegistered] - Whether current user is registered
 * @property {ContestProblem[]} [problems] - Contest problems (if started)
 */

/**
 * Contest problem
 * @typedef {Object} ContestProblem
 * @property {string} id - Problem UUID
 * @property {string} title - Problem title
 * @property {string} slug - Problem slug
 * @property {ProblemDifficulty} difficulty - Difficulty
 * @property {number} points - Points for solving
 * @property {number} orderIndex - Order in contest
 */

/**
 * Contest leaderboard request parameters
 * @typedef {Object} GetLeaderboardParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=100] - Items per page (max 200)
 */

/**
 * Leaderboard entry
 * @typedef {Object} LeaderboardEntry
 * @property {number} rank - Current rank
 * @property {UserSummary} user - User info
 * @property {number} score - Total score
 * @property {number} penalty - Total penalty time
 * @property {number} problemsSolved - Problems solved count
 * @property {Date} [lastSubmissionAt] - Last submission timestamp
 */

/**
 * Contest leaderboard response
 * @typedef {Object} GetLeaderboardResponse
 * @property {Object} contest - Contest info
 * @property {string} contest.id - Contest UUID
 * @property {string} contest.title - Contest title
 * @property {ContestStatus} contest.status - Contest status
 * @property {LeaderboardEntry[]} leaderboard - Leaderboard entries
 * @property {PaginationResponse} pagination - Pagination info
 */

// =====================
// Submission Types
// =====================

/**
 * @typedef {'QUEUED' | 'RUNNING' | 'COMPILE_ERROR' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'MEMORY_LIMIT_EXCEEDED' | 'ACCEPTED' | 'PARTIAL' | 'FAILED'} SubmissionStatus
 */

/**
 * @typedef {'javascript' | 'python' | 'java' | 'cpp' | 'c' | 'csharp' | 'go' | 'rust' | 'typescript' | 'kotlin' | 'swift' | 'ruby' | 'php'} ProgrammingLanguage
 */

/**
 * @typedef {'createdAt' | 'status' | 'time' | 'memory' | 'score'} SubmissionSortBy
 */

/**
 * Create submission request body
 * @typedef {Object} CreateSubmissionRequest
 * @property {string} problemId - Problem UUID
 * @property {ProgrammingLanguage} language - Programming language
 * @property {string} code - Source code (max 64KB)
 * @property {string} [contestId] - Contest UUID (optional)
 */

/**
 * Create submission response
 * @typedef {Object} CreateSubmissionResponse
 * @property {string} id - Submission UUID
 * @property {string} problemId - Problem UUID
 * @property {ProgrammingLanguage} language - Programming language
 * @property {SubmissionStatus} status - Current status
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * Run code request body
 * @typedef {Object} RunCodeRequest
 * @property {ProgrammingLanguage} language - Programming language
 * @property {string} code - Source code (max 64KB)
 * @property {string} [stdin=''] - Standard input (max 10KB)
 */

/**
 * Run code response
 * @typedef {Object} RunCodeResponse
 * @property {string} runId - Run token/ID
 * @property {'QUEUED' | 'RUNNING'} status - Current status
 * @property {ProgrammingLanguage} language - Programming language
 * @property {string} [stdout] - Standard output
 * @property {string} [stderr] - Standard error
 * @property {string} [compilationError] - Compilation error message
 */

/**
 * Submission list request parameters
 * @typedef {Object} GetSubmissionListParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=20] - Items per page (max 100)
 * @property {string} [problemId] - Filter by problem UUID
 * @property {string} [contestId] - Filter by contest UUID
 * @property {SubmissionStatus} [status] - Filter by status
 * @property {ProgrammingLanguage} [language] - Filter by language
 * @property {SubmissionSortBy} [sortBy='createdAt'] - Sort field
 * @property {SortOrder} [sortOrder='desc'] - Sort direction
 */

/**
 * Submission summary
 * @typedef {Object} SubmissionSummary
 * @property {string} id - Submission UUID
 * @property {string} problemId - Problem UUID
 * @property {string} [problemTitle] - Problem title
 * @property {ProgrammingLanguage} language - Programming language
 * @property {SubmissionStatus} status - Verdict status
 * @property {number} [time] - Execution time in ms
 * @property {number} [memory] - Memory usage in KB
 * @property {number} [score] - Score (for partial scoring)
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * Submission list response
 * @typedef {Object} GetSubmissionListResponse
 * @property {SubmissionSummary[]} submissions - List of submissions
 * @property {PaginationResponse} pagination - Pagination info
 */

/**
 * Submission detail response
 * @typedef {Object} SubmissionDetail
 * @property {string} id - Submission UUID
 * @property {string} problemId - Problem UUID
 * @property {string} [contestId] - Contest UUID
 * @property {ProgrammingLanguage} language - Programming language
 * @property {string} [code] - Source code (only for owner)
 * @property {SubmissionStatus} status - Verdict status
 * @property {number} [time] - Execution time in ms
 * @property {number} [memory] - Memory usage in KB
 * @property {number} [score] - Score
 * @property {string} [compilationError] - Compilation error message
 * @property {TestResult[]} [testResults] - Test case results
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * Test result
 * @typedef {Object} TestResult
 * @property {number} testCaseIndex - Test case index
 * @property {SubmissionStatus} status - Result status
 * @property {number} [time] - Execution time
 * @property {number} [memory] - Memory usage
 */

/**
 * Submission statistics
 * @typedef {Object} SubmissionStats
 * @property {number} totalSubmissions - Total submission count
 * @property {number} acceptedCount - Accepted submission count
 * @property {number} wrongAnswerCount - Wrong answer count
 * @property {number} timeoutCount - TLE count
 * @property {number} errorCount - Runtime/compile error count
 * @property {Object} byLanguage - Submissions grouped by language
 * @property {Object} byDate - Submissions grouped by date
 */

// =====================
// User Types
// =====================

/**
 * @typedef {'ALL_TIME' | 'MONTHLY' | 'WEEKLY'} LeaderboardTimeframe
 */

/**
 * User summary (public info)
 * @typedef {Object} UserSummary
 * @property {string} id - User UUID
 * @property {string} username - Username
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 * @property {string} [avatar] - Avatar URL
 */

/**
 * Public user profile
 * @typedef {Object} PublicProfile
 * @property {string} id - User UUID
 * @property {string} username - Username
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 * @property {string} [avatar] - Avatar URL
 * @property {Date} createdAt - Registration date
 * @property {Object} stats - User statistics
 * @property {number} stats.totalSolved - Total problems solved
 * @property {number} stats.easyProblems - Easy problems solved
 * @property {number} stats.mediumProblems - Medium problems solved
 * @property {number} stats.hardProblems - Hard problems solved
 * @property {RecentSubmission[]} recentSubmissions - Recent activity
 */

/**
 * Recent submission for profile
 * @typedef {Object} RecentSubmission
 * @property {string} problemTitle - Problem title
 * @property {string} problemSlug - Problem slug
 * @property {ProblemDifficulty} difficulty - Problem difficulty
 * @property {SubmissionStatus} status - Verdict
 * @property {ProgrammingLanguage} language - Language used
 * @property {Date} createdAt - Submission timestamp
 */

/**
 * Current user profile (private)
 * @typedef {Object} CurrentUserProfile
 * @property {string} id - User UUID
 * @property {string} username - Username
 * @property {string} email - Email address
 * @property {string} [phone] - Phone number
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 * @property {string} [avatar] - Avatar URL
 * @property {'USER' | 'ADMIN' | 'MODERATOR'} role - User role
 * @property {boolean} isActive - Account active status
 * @property {boolean} isVerified - Email verified status
 * @property {'LOCAL' | 'GOOGLE' | 'PHONE'} provider - Auth provider
 * @property {Date} [lastLoginAt] - Last login timestamp
 * @property {Date} createdAt - Registration date
 */

/**
 * Update profile request body
 * @typedef {Object} UpdateProfileRequest
 * @property {string} [firstName] - First name (1-50 chars)
 * @property {string} [lastName] - Last name (1-50 chars)
 * @property {string} [avatar] - Avatar URL
 */

/**
 * Global leaderboard request parameters
 * @typedef {Object} GetGlobalLeaderboardParams
 * @property {number} [page=1] - Page number
 * @property {number} [limit=50] - Items per page (max 100)
 * @property {LeaderboardTimeframe} [timeframe='ALL_TIME'] - Time period
 */

/**
 * Global leaderboard entry
 * @typedef {Object} GlobalLeaderboardEntry
 * @property {number} rank - Global rank
 * @property {UserSummary} user - User info
 * @property {number} problemsSolved - Total problems solved
 * @property {number} totalScore - Calculated score
 * @property {number} contestsParticipated - Contests participated in
 */

/**
 * Global leaderboard response
 * @typedef {Object} GetGlobalLeaderboardResponse
 * @property {LeaderboardTimeframe} timeframe - Time period
 * @property {GlobalLeaderboardEntry[]} leaderboard - Leaderboard entries
 * @property {PaginationResponse} pagination - Pagination info
 */

/**
 * Activity calendar request parameters
 * @typedef {Object} GetActivityCalendarParams
 * @property {number} [months=12] - Months to include (1-24)
 */

/**
 * Activity day entry
 * @typedef {Object} ActivityDay
 * @property {string} date - Date string (YYYY-MM-DD)
 * @property {number} submissions - Total submissions
 * @property {number} accepted - Accepted submissions
 */

/**
 * User rank info
 * @typedef {Object} UserRankInfo
 * @property {number|null} globalRank - Global rank (null if not ranked)
 * @property {number} totalUsers - Total ranked users
 * @property {number} score - User's score
 * @property {number} problemsSolved - Problems solved
 * @property {number} percentile - Percentile (0-100)
 */

// =====================
// Editorial Types
// =====================

/**
 * Editorial response
 * @typedef {Object} Editorial
 * @property {string} id - Editorial UUID
 * @property {string} problemId - Problem UUID
 * @property {string} content - Editorial content (markdown)
 * @property {string} complexity - Time/space complexity analysis
 * @property {Date} [publishedAt] - Publication date
 */

/**
 * Hint summary (without content)
 * @typedef {Object} HintSummary
 * @property {string} id - Hint UUID
 * @property {number} orderIndex - Order in list
 * @property {number} penalty - Score penalty for unlocking
 */

/**
 * Hint detail (with content)
 * @typedef {Object} HintDetail
 * @property {string} id - Hint UUID
 * @property {string} content - Hint content
 * @property {number} orderIndex - Order in list
 * @property {number} penalty - Score penalty
 */

// =====================
// Auth Types
// =====================

/**
 * JWT login request
 * @typedef {Object} JwtLoginRequest
 * @property {string} identifier - Email, username, or phone
 * @property {string} password - Password
 */

/**
 * JWT register request
 * @typedef {Object} JwtRegisterRequest
 * @property {string} username - Username (3-30 chars)
 * @property {string} email - Email address
 * @property {string} password - Password (min 8 chars)
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 */

/**
 * Auth response
 * @typedef {Object} AuthResponse
 * @property {string} token - JWT token
 * @property {CurrentUserProfile} user - User profile
 */

/**
 * Phone OTP send request
 * @typedef {Object} SendOtpRequest
 * @property {string} phone - Phone number with country code
 */

/**
 * Phone OTP verify request
 * @typedef {Object} VerifyOtpRequest
 * @property {string} phone - Phone number
 * @property {string} otp - 6-digit OTP code
 */

// Export for JSDoc reference (not runtime)
export const Types = {
  // This is a placeholder to allow importing types in JSDoc
};

export default Types;
