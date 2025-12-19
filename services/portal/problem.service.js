/**
 * @fileoverview Portal Problem Service
 * Business logic for portal problem operations
 * Delegates to repository for data access
 */

import portalProblemRepository from '../../../library/domain/portal/portalProblemRepository.js';
import { problemMessages } from '../../../constant/portalMessages.js';

/**
 * Get public problems with filters
 * @param {Object} filters - Query filters
 * @param {string|null} userId - User ID for solved status (optional)
 * @returns {Promise<Object>} Paginated problems with solved status
 */
async function getPublicProblems(filters, userId = null) {
  const result = await portalProblemRepository.findPublicProblems(filters);

  // If user is authenticated, mark solved problems
  if (userId) {
    const solvedIds = await portalProblemRepository.getUserSolvedProblems(userId);
    result.problems = result.problems.map(problem => ({
      ...problem,
      isSolved: solvedIds.includes(problem.id),
    }));
  }

  return result;
}

/**
 * Get problem details by slug
 * @param {string} slug - Problem slug
 * @param {string|null} userId - User ID for user-specific data
 * @returns {Promise<Object>} Problem details or null
 * @throws {Error} If problem not found
 */
async function getProblemBySlug(slug, userId = null) {
  const problem = await portalProblemRepository.findPublicProblemBySlug(slug, userId);

  if (!problem) {
    const error = new Error(problemMessages.problemNotFound);
    error.statusCode = 404;
    throw error;
  }

  return problem;
}

/**
 * Get popular problem tags
 * @returns {Promise<Array>} Tags with counts
 */
async function getPopularTags() {
  return await portalProblemRepository.getPopularTags();
}

/**
 * Get user's solved problem IDs
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Solved problems info
 */
async function getUserSolvedProblems(userId) {
  const solvedIds = await portalProblemRepository.getUserSolvedProblems(userId);
  
  return {
    count: solvedIds.length,
    problemIds: solvedIds,
  };
}

export default {
  getPublicProblems,
  getProblemBySlug,
  getPopularTags,
  getUserSolvedProblems,
};

export {
  getPublicProblems,
  getProblemBySlug,
  getPopularTags,
  getUserSolvedProblems,
};
