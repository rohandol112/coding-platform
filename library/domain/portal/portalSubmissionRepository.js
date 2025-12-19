/**
 * @fileoverview Portal Submission Repository - User Submission Data Access
 * Contains database operations for portal (user-facing) submission endpoints
 */

import prismaClient from '../../database/prismaClient.js';

/**
 * Create a new submission
 * @param {Object} data - Submission data
 * @returns {Promise<Object>} Created submission
 */
async function createSubmission(data) {
  return await prismaClient.submission.create({
    data: {
      userId: data.userId,
      problemId: data.problemId,
      contestId: data.contestId || null,
      language: data.language,
      code: data.code,
      status: 'QUEUED',
    },
    select: {
      id: true,
      userId: true,
      problemId: true,
      contestId: true,
      language: true,
      status: true,
      createdAt: true,
    },
  });
}

/**
 * Find submission by ID
 * @param {string} id - Submission ID
 * @param {string} userId - User ID (for ownership verification)
 * @returns {Promise<Object|null>} Submission or null
 */
async function findById(id, userId = null) {
  const where = { id };
  
  const submission = await prismaClient.submission.findUnique({
    where,
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          timeLimit: true,
          memoryLimit: true,
        },
      },
      contest: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  // Check ownership if userId provided
  if (submission && userId && submission.userId !== userId) {
    // Return limited info for non-owners (public submission view)
    return {
      id: submission.id,
      problemId: submission.problemId,
      problem: submission.problem,
      language: submission.language,
      status: submission.status,
      time: submission.time,
      memory: submission.memory,
      score: submission.score,
      createdAt: submission.createdAt,
      // Don't include source code for non-owners
    };
  }

  return submission;
}

/**
 * Find user's submissions with filters
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Paginated submissions
 */
async function findUserSubmissions(userId, filters = {}) {
  const {
    page = 1,
    limit = 20,
    problemId,
    contestId,
    status,
    language,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where = { userId };
  
  if (problemId) where.problemId = problemId;
  if (contestId) where.contestId = contestId;
  if (status) where.status = status;
  if (language) where.language = language;

  const skip = (page - 1) * Math.min(limit, 100);
  const take = Math.min(limit, 100);
  const orderBy = { [sortBy]: sortOrder };

  const [submissions, total] = await Promise.all([
    prismaClient.submission.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        problemId: true,
        contestId: true,
        language: true,
        status: true,
        score: true,
        time: true,
        memory: true,
        createdAt: true,
        judgedAt: true,
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
          },
        },
        contest: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    }),
    prismaClient.submission.count({ where }),
  ]);

  return {
    submissions,
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

/**
 * Get recent submissions for a problem
 * @param {string} problemId - Problem ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Recent submissions
 */
async function getProblemSubmissions(problemId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * Math.min(limit, 50);
  const take = Math.min(limit, 50);

  const [submissions, total] = await Promise.all([
    prismaClient.submission.findMany({
      where: { problemId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        language: true,
        status: true,
        time: true,
        memory: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    }),
    prismaClient.submission.count({ where: { problemId } }),
  ]);

  return {
    submissions,
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

/**
 * Update submission status
 * @param {string} id - Submission ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated submission
 */
async function updateStatus(id, status) {
  return await prismaClient.submission.update({
    where: { id },
    data: { status },
  });
}

/**
 * Update submission with judge result
 * @param {string} id - Submission ID
 * @param {Object} result - Judge result
 * @returns {Promise<Object>} Updated submission
 */
async function updateJudgeResult(id, result) {
  return await prismaClient.submission.update({
    where: { id },
    data: {
      status: result.status,
      score: result.score,
      time: result.time,
      memory: result.memory,
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      testCaseResults: result.testCaseResults,
      judgedAt: new Date(),
    },
  });
}

/**
 * Get submission statistics for user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User submission stats
 */
async function getUserSubmissionStats(userId) {
  const [
    totalSubmissions,
    acceptedSubmissions,
    byStatus,
    byLanguage,
    problemsSolved,
  ] = await Promise.all([
    prismaClient.submission.count({ where: { userId } }),
    prismaClient.submission.count({ 
      where: { userId, status: 'ACCEPTED' } 
    }),
    prismaClient.submission.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
    }),
    prismaClient.submission.groupBy({
      by: ['language'],
      where: { userId },
      _count: true,
    }),
    prismaClient.submission.findMany({
      where: { userId, status: 'ACCEPTED' },
      distinct: ['problemId'],
      select: { problemId: true },
    }),
  ]);

  // Get difficulty breakdown
  const solvedProblemIds = problemsSolved.map(s => s.problemId);
  const difficultyBreakdown = await prismaClient.problem.groupBy({
    by: ['difficulty'],
    where: { id: { in: solvedProblemIds } },
    _count: true,
  });

  return {
    totalSubmissions,
    acceptedSubmissions,
    acceptanceRate: totalSubmissions > 0 
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100 * 10) / 10
      : 0,
    problemsSolved: solvedProblemIds.length,
    byStatus: byStatus.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {}),
    byLanguage: byLanguage.reduce((acc, item) => {
      acc[item.language] = item._count;
      return acc;
    }, {}),
    byDifficulty: difficultyBreakdown.reduce((acc, item) => {
      acc[item.difficulty] = item._count;
      return acc;
    }, {}),
  };
}

/**
 * Check submission rate limit
 * @param {string} userId - User ID
 * @param {number} minutes - Time window in minutes
 * @param {number} maxSubmissions - Max submissions allowed
 * @returns {Promise<Object>} Rate limit info
 */
async function checkRateLimit(userId, minutes = 1, maxSubmissions = 10) {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  
  const count = await prismaClient.submission.count({
    where: {
      userId,
      createdAt: { gte: since },
    },
  });

  return {
    allowed: count < maxSubmissions,
    current: count,
    limit: maxSubmissions,
    resetIn: minutes * 60 - Math.floor((Date.now() - since.getTime()) / 1000),
  };
}

/**
 * Get user's best submission for a problem
 * @param {string} userId - User ID
 * @param {string} problemId - Problem ID
 * @returns {Promise<Object|null>} Best submission
 */
async function getBestSubmission(userId, problemId) {
  // First try to get accepted submission
  const accepted = await prismaClient.submission.findFirst({
    where: {
      userId,
      problemId,
      status: 'ACCEPTED',
    },
    orderBy: [
      { time: 'asc' },
      { memory: 'asc' },
    ],
    select: {
      id: true,
      language: true,
      status: true,
      time: true,
      memory: true,
      score: true,
      createdAt: true,
    },
  });

  if (accepted) return accepted;

  // Otherwise get highest scoring submission
  return await prismaClient.submission.findFirst({
    where: {
      userId,
      problemId,
    },
    orderBy: [
      { score: 'desc' },
      { createdAt: 'desc' },
    ],
    select: {
      id: true,
      language: true,
      status: true,
      time: true,
      memory: true,
      score: true,
      createdAt: true,
    },
  });
}

export default {
  createSubmission,
  findById,
  findUserSubmissions,
  getProblemSubmissions,
  updateStatus,
  updateJudgeResult,
  getUserSubmissionStats,
  checkRateLimit,
  getBestSubmission,
};

export {
  createSubmission,
  findById,
  findUserSubmissions,
  getProblemSubmissions,
  updateStatus,
  updateJudgeResult,
  getUserSubmissionStats,
  checkRateLimit,
  getBestSubmission,
};
