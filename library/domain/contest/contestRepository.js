/**
 * @fileoverview Contest Repository - Pure Data Access Layer
 * Contains only database operations, no business logic
 */

import prismaClient from '../../database/prismaClient.js';

/**
 * Create a new contest
 * @param {Object} data - Contest data
 * @returns {Promise<Object>} Created contest
 */
async function create(data) {
  return await prismaClient.contest.create({
    data,
  });
}

/**
 * Find contest by ID
 * @param {string} id - Contest ID
 * @param {Object} options - Query options
 * @param {boolean} options.includeProblems - Include contest problems
 * @param {boolean} options.includeParticipants - Include participants
 * @returns {Promise<Object|null>} Contest or null
 */
async function findById(id, options = {}) {
  const include = {};
  
  if (options.includeProblems) {
    include.problems = {
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
      },
      orderBy: { orderIndex: 'asc' },
    };
  }

  if (options.includeParticipants) {
    include.participants = {
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    };
  }

  return await prismaClient.contest.findUnique({
    where: { id },
    include: Object.keys(include).length > 0 ? include : undefined,
  });
}

/**
 * Find contests with filters and pagination
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Paginated contests
 */
async function findMany(filters = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    type,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where = {};
  
  if (status) where.status = status;
  if (type) where.type = type;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;
  const orderBy = { [sortBy]: sortOrder };

  const [contests, total] = await Promise.all([
    prismaClient.contest.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: {
          select: {
            participants: true,
            problems: true,
          },
        },
      },
    }),
    prismaClient.contest.count({ where }),
  ]);

  return {
    contests,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Update contest
 * @param {string} id - Contest ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated contest
 */
async function update(id, data) {
  return await prismaClient.contest.update({
    where: { id },
    data,
  });
}

/**
 * Delete contest
 * @param {string} id - Contest ID
 * @returns {Promise<Object>} Deleted contest
 */
async function deleteById(id) {
  return await prismaClient.contest.delete({
    where: { id },
  });
}

/**
 * Add problem to contest
 * @param {string} contestId - Contest ID
 * @param {string} problemId - Problem ID
 * @param {Object} problemData - Problem data (orderIndex, points, bonusPoints)
 * @returns {Promise<Object>} Contest problem relation
 */
async function addProblem(contestId, problemId, problemData = {}) {
  return await prismaClient.contestProblem.create({
    data: {
      contestId,
      problemId,
      orderIndex: problemData.orderIndex,
      points: problemData.points,
      bonusPoints: problemData.bonusPoints,
    },
  });
}

/**
 * Remove problem from contest
 * @param {string} contestId - Contest ID
 * @param {string} problemId - Problem ID
 * @returns {Promise<Object>} Deleted contest problem
 */
async function removeProblem(contestId, problemId) {
  return await prismaClient.contestProblem.delete({
    where: {
      contestId_problemId: { contestId, problemId },
    },
  });
}

/**
 * Get contest participants
 * @param {string} contestId - Contest ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Paginated participants
 */
async function getParticipants(contestId, { page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;

  const [participants, total] = await Promise.all([
    prismaClient.contestParticipant.findMany({
      where: { contestId },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { registeredAt: 'asc' },
    }),
    prismaClient.contestParticipant.count({
      where: { contestId },
    }),
  ]);

  return {
    participants,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get contest leaderboard
 * @param {string} contestId - Contest ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Paginated leaderboard
 */
async function getLeaderboard(contestId, { page = 1, limit = 100 } = {}) {
  const skip = (page - 1) * limit;

  const [leaderboard, total] = await Promise.all([
    prismaClient.contestParticipant.findMany({
      where: { contestId },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: [
        { totalScore: 'desc' },
        { lastSubmissionTime: 'asc' },
      ],
    }),
    prismaClient.contestParticipant.count({
      where: { contestId },
    }),
  ]);

  return {
    leaderboard,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Check if contest slug exists
 * @param {string} slug - Contest slug
 * @param {string} excludeId - Contest ID to exclude from check (for updates)
 * @returns {Promise<boolean>} True if slug exists
 */
async function slugExists(slug, excludeId = null) {
  const where = { slug };
  if (excludeId) {
    where.NOT = { id: excludeId };
  }

  const count = await prismaClient.contest.count({ where });
  return count > 0;
}

module.exports = {
  create,
  findById,
  findMany,
  update,
  deleteById,
  addProblem,
  removeProblem,
  getParticipants,
  getLeaderboard,
  slugExists,
};

export default {
  create,
  findById,
  findBySlug,
  findMany,
  update,
  deleteById,
  addProblem,
  removeProblem,
  getParticipants,
  getLeaderboard,
  slugExists,
};
