/**
 * @fileoverview Problem Repository - Pure Data Access Layer
 * Contains only database operations, no business logic
 */

const prismaClient = require('../../database/prismaClient');

/**
 * Create a new problem
 * @param {Object} data - Problem data
 * @returns {Promise<Object>} Created problem
 */
async function create(data) {
  return await prismaClient.problem.create({
    data,
  });
}

/**
 * Find problem by ID
 * @param {string} id - Problem ID
 * @param {Object} options - Query options
 * @param {boolean} options.includeTestCases - Include test cases
 * @returns {Promise<Object|null>} Problem or null
 */
async function findById(id, options = {}) {
  const include = {};
  
  if (options.includeTestCases) {
    include.testCases = {
      orderBy: { orderIndex: 'asc' },
    };
  }

  return await prismaClient.problem.findUnique({
    where: { id },
    include: Object.keys(include).length > 0 ? include : undefined,
  });
}

/**
 * Find problem by slug
 * @param {string} slug - Problem slug
 * @returns {Promise<Object|null>} Problem or null
 */
async function findBySlug(slug) {
  return await prismaClient.problem.findUnique({
    where: { slug },
  });
}

/**
 * Find problems with filters and pagination
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Paginated problems
 */
async function findMany(filters = {}) {
  const {
    page = 1,
    limit = 20,
    difficulty,
    tags,
    search,
    isPublic,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where = {};
  
  if (difficulty) where.difficulty = difficulty;
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : tags.split(',');
    where.tags = { hasSome: tagArray };
  }
  if (isPublic !== undefined) where.isPublic = isPublic;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;
  const orderBy = { [sortBy]: sortOrder };

  const [problems, total] = await Promise.all([
    prismaClient.problem.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: {
          select: {
            submissions: true,
            testCases: true,
          },
        },
      },
    }),
    prismaClient.problem.count({ where }),
  ]);

  return {
    problems,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Update problem
 * @param {string} id - Problem ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated problem
 */
async function update(id, data) {
  return await prismaClient.problem.update({
    where: { id },
    data,
  });
}

/**
 * Delete problem
 * @param {string} id - Problem ID
 * @returns {Promise<Object>} Deleted problem
 */
async function deleteById(id) {
  return await prismaClient.problem.delete({
    where: { id },
  });
}

/**
 * Check if problem slug exists
 * @param {string} slug - Problem slug
 * @param {string} excludeId - Problem ID to exclude from check (for updates)
 * @returns {Promise<boolean>} True if slug exists
 */
async function slugExists(slug, excludeId = null) {
  const where = { slug };
  if (excludeId) {
    where.NOT = { id: excludeId };
  }

  const count = await prismaClient.problem.count({ where });
  return count > 0;
}

/**
 * Check if problem is used in any contest
 * @param {string} problemId - Problem ID
 * @returns {Promise<boolean>} True if used in contest
 */
async function isUsedInContest(problemId) {
  const count = await prismaClient.contestProblem.count({
    where: { problemId },
  });
  return count > 0;
}

/**
 * Create test case for problem
 * @param {Object} data - Test case data
 * @returns {Promise<Object>} Created test case
 */
async function createTestCase(data) {
  return await prismaClient.testCase.create({
    data,
  });
}

/**
 * Find test case by ID
 * @param {string} id - Test case ID
 * @returns {Promise<Object|null>} Test case or null
 */
async function findTestCaseById(id) {
  return await prismaClient.testCase.findUnique({
    where: { id },
  });
}

/**
 * Get test cases for a problem
 * @param {string} problemId - Problem ID
 * @param {boolean} includeHidden - Include hidden test cases
 * @returns {Promise<Array>} Test cases
 */
async function getTestCases(problemId, includeHidden = true) {
  const where = { problemId };
  if (!includeHidden) {
    where.isHidden = false;
  }

  return await prismaClient.testCase.findMany({
    where,
    orderBy: { orderIndex: 'asc' },
  });
}

/**
 * Update test case
 * @param {string} id - Test case ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated test case
 */
async function updateTestCase(id, data) {
  return await prismaClient.testCase.update({
    where: { id },
    data,
  });
}

/**
 * Delete test case
 * @param {string} id - Test case ID
 * @returns {Promise<Object>} Deleted test case
 */
async function deleteTestCase(id) {
  return await prismaClient.testCase.delete({
    where: { id },
  });
}

/**
 * Count test cases for a problem
 * @param {string} problemId - Problem ID
 * @returns {Promise<number>} Test case count
 */
async function countTestCases(problemId) {
  return await prismaClient.testCase.count({
    where: { problemId },
  });
}

module.exports = {
  create,
  findById,
  findBySlug,
  findMany,
  update,
  deleteById,
  slugExists,
  isUsedInContest,
  createTestCase,
  findTestCaseById,
  getTestCases,
  updateTestCase,
  deleteTestCase,
  countTestCases,
};
