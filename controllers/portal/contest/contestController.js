/**
 * @fileoverview Portal Contest Controller
 * Handles HTTP requests for public contest endpoints
 * Thin layer - delegates business logic to services
 */

import contestService from '../../../services/portal/contest.service.js';
import { contestMessages, portalMessages } from '../../../constant/portalMessages.js';

/**
 * Get all public contests with filters
 * GET /api/portal/contests
 */
async function getContests(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      search,
      sortBy = 'startTime',
      sortOrder = 'desc',
    } = req.query;

    const filters = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status,
      type,
      search,
      sortBy,
      sortOrder,
    };

    const result = await contestService.getPublicContests(filters);

    return res.status(200).json({
      success: true,
      message: contestMessages.contestsFetchedSuccess,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching contests:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get contest details by slug
 * GET /api/portal/contests/:slug
 */
async function getContestBySlug(req, res) {
  try {
    const { slug } = req.params;
    const userId = req.user?.id || null;

    const contest = await contestService.getContestBySlug(slug, userId);

    return res.status(200).json({
      success: true,
      message: contestMessages.contestFetchedSuccess,
      data: contest,
    });
  } catch (error) {
    console.error('Error fetching contest:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Register for contest
 * POST /api/portal/contests/:contestId/register
 */
async function registerForContest(req, res) {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;

    const result = await contestService.registerForContest(contestId, userId);

    return res.status(201).json({
      success: true,
      message: contestMessages.registrationSuccess,
      data: result,
    });
  } catch (error) {
    console.error('Error registering for contest:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Unregister from contest
 * DELETE /api/portal/contests/:contestId/register
 */
async function unregisterFromContest(req, res) {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;

    await contestService.unregisterFromContest(contestId, userId);

    return res.status(200).json({
      success: true,
      message: contestMessages.unregistrationSuccess,
    });
  } catch (error) {
    console.error('Error unregistering from contest:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get contest leaderboard
 * GET /api/portal/contests/:contestId/leaderboard
 */
async function getContestLeaderboard(req, res) {
  try {
    const { contestId } = req.params;
    const { page = 1, limit = 100 } = req.query;

    const result = await contestService.getContestLeaderboard(contestId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    return res.status(200).json({
      success: true,
      message: contestMessages.leaderboardFetchedSuccess,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get upcoming contests
 * GET /api/portal/contests/upcoming
 */
async function getUpcomingContests(req, res) {
  try {
    const { limit = 5 } = req.query;

    const contests = await contestService.getUpcomingContests(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      message: contestMessages.upcomingContestsFetchedSuccess,
      data: { contests },
    });
  } catch (error) {
    console.error('Error fetching upcoming contests:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get running contests
 * GET /api/portal/contests/running
 */
async function getRunningContests(req, res) {
  try {
    const contests = await contestService.getRunningContests();

    return res.status(200).json({
      success: true,
      message: contestMessages.runningContestsFetchedSuccess,
      data: { contests },
    });
  } catch (error) {
    console.error('Error fetching running contests:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get user's registered contests
 * GET /api/portal/contests/my
 */
async function getMyContests(req, res) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const result = await contestService.getUserContests(userId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    return res.status(200).json({
      success: true,
      message: contestMessages.myContestsFetchedSuccess,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching user contests:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export {
  getContests,
  getContestBySlug,
  registerForContest,
  unregisterFromContest,
  getContestLeaderboard,
  getUpcomingContests,
  getRunningContests,
  getMyContests,
};

export default {
  getContests,
  getContestBySlug,
  registerForContest,
  unregisterFromContest,
  getContestLeaderboard,
  getUpcomingContests,
  getRunningContests,
  getMyContests,
};
