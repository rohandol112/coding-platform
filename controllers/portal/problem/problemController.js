/**
 * @fileoverview Portal Problem Controller
 * Handles HTTP requests for public problem endpoints
 * Thin layer - delegates business logic to services
 */

import problemService from '../../../services/portal/problem.service.js';
import { problemMessages, portalMessages } from '../../../constant/portalMessages.js';

/**
 * Get all public problems with filters
 * GET /api/portal/problems
 */
async function getProblems(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      difficulty,
      tags,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filters = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      difficulty,
      tags,
      search,
      sortBy,
      sortOrder,
    };

    const userId = req.user?.id || null;
    const result = await problemService.getPublicProblems(filters, userId);

    return res.status(200).json({
      success: true,
      message: problemMessages.problemsFetchedSuccess,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get problem details by slug
 * GET /api/portal/problems/:slug
 */
async function getProblemBySlug(req, res) {
  try {
    const { slug } = req.params;
    const userId = req.user?.id || null;

    const problem = await problemService.getProblemBySlug(slug, userId);

    return res.status(200).json({
      success: true,
      message: problemMessages.problemFetchedSuccess,
      data: problem,
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get popular tags
 * GET /api/portal/problems/tags
 */
async function getPopularTags(req, res) {
  try {
    const tags = await problemService.getPopularTags();

    return res.status(200).json({
      success: true,
      message: problemMessages.tagsFetchedSuccess,
      data: { tags },
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get user's solved problems
 * GET /api/portal/problems/solved
 */
async function getSolvedProblems(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: portalMessages.authRequired,
      });
    }

    const result = await problemService.getUserSolvedProblems(req.user.id);

    return res.status(200).json({
      success: true,
      message: problemMessages.solvedProblemsFetchedSuccess,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching solved problems:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export {
  getProblems,
  getProblemBySlug,
  getPopularTags,
  getSolvedProblems,
};

export default {
  getProblems,
  getProblemBySlug,
  getPopularTags,
  getSolvedProblems,
};
