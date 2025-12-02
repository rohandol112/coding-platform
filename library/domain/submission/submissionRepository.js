/**
 * @fileoverview Submission Repository - Database operations
 * Pure data access layer (no business logic)
 */

const prisma = require('../../database/prismaClient');

/**
 * Create a new submission
 * @param {Object} data - Submission data
 * @returns {Promise<Object>} Created submission
 */
async function create(data) {
  return await prisma.submission.create({
    data: {
      id: data.id,
      userId: data.userId,
      problemId: data.problemId,
      language: data.language,
      code: data.code,
      status: data.status,
      isRunOnly: data.isRunOnly || false,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    },
  });
}

/**
 * Find submission by ID
 * @param {string} id - Submission ID
 * @param {Object} options - Query options
 * @returns {Promise<Object|null>} Submission or null
 */
async function findById(id, options = {}) {
  return await prisma.submission.findUnique({
    where: { id },
    include: options.include || {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      problem: {
        select: {
          id: true,
          title: true,
          difficulty: true,
        },
      },
    },
  });
}

/**
 * Update submission status
 * @param {string} id - Submission ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated submission
 */
async function updateStatus(id, status) {
  return await prisma.submission.update({
    where: { id },
    data: { status },
  });
}

/**
 * Update submission with final result
 * @param {string} id - Submission ID
 * @param {Object} result - Result data
 * @returns {Promise<Object>} Updated submission
 */
async function updateResult(id, result) {
  return await prisma.submission.update({
    where: { id },
    data: {
      status: result.status,
      score: result.score,
      time: result.time,
      memory: result.memory,
      stdout: result.stdout,
      stderr: result.stderr,
      testcaseResults: result.testcaseResults,
      finishedAt: result.finishedAt ? new Date(result.finishedAt) : new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      problem: {
        select: {
          id: true,
        },
      },
    },
  });
}

/**
 * Find user submissions with pagination
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Paginated submissions
 */
async function findByUser(userId, filters = {}) {
  const where = { userId };
  if (filters.problemId) where.problemId = filters.problemId;
  if (filters.status) where.status = filters.status;

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;
  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
    }),
    prisma.submission.count({ where }),
  ]);

  return {
    submissions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = {
  create,
  findById,
  updateStatus,
  updateResult,
  findByUser,
};
