/**
 * @fileoverview Portal Problem Repository - Public Problem Data Access
 * Contains database operations for portal (user-facing) problem endpoints
 */

import prismaClient from '../../database/prismaClient.js';

/**
 * Find public problems with filters and pagination
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Paginated problems
 */
async function findPublicProblems(filters = {}) {
  const {
    page = 1,
    limit = 20,
    difficulty,
    tags,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where = {
    isPublic: true,
  };
  
  if (difficulty) where.difficulty = difficulty;
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    where.tags = { hasSome: tagArray };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { statement: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * Math.min(limit, 100);
  const take = Math.min(limit, 100);
  const orderBy = { [sortBy]: sortOrder };

  const [problems, total] = await Promise.all([
    prismaClient.problem.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        tags: true,
        timeLimit: true,
        memoryLimit: true,
        createdAt: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    }),
    prismaClient.problem.count({ where }),
  ]);

  // Calculate acceptance rate for each problem
  const problemsWithStats = await Promise.all(
    problems.map(async (problem) => {
      const acceptedCount = await prismaClient.submission.count({
        where: {
          problemId: problem.id,
          status: 'ACCEPTED',
        },
      });
      
      const totalSubmissions = problem._count.submissions;
      const acceptanceRate = totalSubmissions > 0 
        ? Math.round((acceptedCount / totalSubmissions) * 100 * 10) / 10
        : 0;

      return {
        ...problem,
        totalSubmissions,
        acceptedCount,
        acceptanceRate,
        _count: undefined,
      };
    })
  );

  return {
    problems: problemsWithStats,
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

/**
 * Find public problem by slug with details
 * @param {string} slug - Problem slug
 * @param {string} userId - Optional user ID to check solved status
 * @returns {Promise<Object|null>} Problem or null
 */
async function findPublicProblemBySlug(slug, userId = null) {
  const problem = await prismaClient.problem.findFirst({
    where: {
      slug,
      isPublic: true,
    },
    include: {
      testCases: {
        where: { isHidden: false },
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          input: true,
          expectedOutput: true,
          explanation: true,
          orderIndex: true,
        },
      },
      editorials: {
        where: { isPublished: true },
        select: {
          id: true,
          hints: {
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              orderIndex: true,
              penalty: true,
            },
          },
        },
      },
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });

  if (!problem) return null;

  // Get acceptance stats
  const acceptedCount = await prismaClient.submission.count({
    where: {
      problemId: problem.id,
      status: 'ACCEPTED',
    },
  });

  // Check if user has solved it
  let userSolved = false;
  let userAttempts = 0;
  if (userId) {
    const userAccepted = await prismaClient.submission.count({
      where: {
        problemId: problem.id,
        userId,
        status: 'ACCEPTED',
      },
    });
    userSolved = userAccepted > 0;

    userAttempts = await prismaClient.submission.count({
      where: {
        problemId: problem.id,
        userId,
      },
    });
  }

  const totalSubmissions = problem._count.submissions;
  const acceptanceRate = totalSubmissions > 0 
    ? Math.round((acceptedCount / totalSubmissions) * 100 * 10) / 10
    : 0;

  return {
    ...problem,
    sampleTestCases: problem.testCases,
    testCases: undefined,
    hasEditorial: problem.editorials.length > 0,
    hintsAvailable: problem.editorials[0]?.hints?.length || 0,
    editorials: undefined,
    totalSubmissions,
    acceptedCount,
    acceptanceRate,
    userSolved,
    userAttempts,
    _count: undefined,
  };
}

/**
 * Get problem tags with counts
 * @returns {Promise<Array>} Tags with problem counts
 */
async function getPopularTags() {
  const problems = await prismaClient.problem.findMany({
    where: { isPublic: true },
    select: { tags: true },
  });

  const tagCount = {};
  problems.forEach(p => {
    p.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get user's solved problems
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of solved problem IDs
 */
async function getUserSolvedProblems(userId) {
  const solved = await prismaClient.submission.findMany({
    where: {
      userId,
      status: 'ACCEPTED',
    },
    distinct: ['problemId'],
    select: { problemId: true },
  });

  return solved.map(s => s.problemId);
}

export default {
  findPublicProblems,
  findPublicProblemBySlug,
  getPopularTags,
  getUserSolvedProblems,
};

export {
  findPublicProblems,
  findPublicProblemBySlug,
  getPopularTags,
  getUserSolvedProblems,
};
