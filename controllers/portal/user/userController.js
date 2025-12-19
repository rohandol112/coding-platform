/**
 * @fileoverview Portal User Controller
 * Handles HTTP requests for user profile and leaderboard endpoints
 * Thin layer - delegates business logic to services
 */

import userService from '../../../services/portal/user.service.js';
import { userProfileMessages, portalMessages } from '../../../constant/portalMessages.js';

/**
 * Get public user profile by username
 * GET /api/portal/users/:username
 */
async function getPublicProfile(req, res) {
  try {
    const { username } = req.params;

    const profile = await userService.getPublicProfile(username);

    return res.status(200).json({
      success: true,
      message: userProfileMessages.profileFetchedSuccess,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get global leaderboard
 * GET /api/portal/leaderboard
 */
async function getGlobalLeaderboard(req, res) {
  try {
    const {
      page = 1,
      limit = 50,
      timeframe = 'ALL_TIME',
    } = req.query;

    const result = await userService.getGlobalLeaderboard({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      timeframe,
    });

    return res.status(200).json({
      success: true,
      message: userProfileMessages.leaderboardFetchedSuccess,
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
 * Get current user's profile
 * GET /api/portal/users/me
 */
async function getCurrentUserProfile(req, res) {
  try {
    const userId = req.user.id;

    const profile = await userService.getCurrentUserProfile(userId);

    return res.status(200).json({
      success: true,
      message: userProfileMessages.profileFetchedSuccess,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Update current user's profile
 * PUT /api/portal/users/me
 */
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { firstName, lastName, avatar } = req.body;

    const updatedUser = await userService.updateProfile(userId, {
      firstName,
      lastName,
      avatar,
    });

    return res.status(200).json({
      success: true,
      message: userProfileMessages.profileUpdatedSuccess,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get user's activity calendar
 * GET /api/portal/users/me/activity
 */
async function getActivityCalendar(req, res) {
  try {
    const userId = req.user.id;
    const { months = 12 } = req.query;

    const activity = await userService.getActivityCalendar(userId, parseInt(months, 10));

    return res.status(200).json({
      success: true,
      message: userProfileMessages.activityFetchedSuccess,
      data: { activity },
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get user's global rank
 * GET /api/portal/users/me/rank
 */
async function getUserRank(req, res) {
  try {
    const userId = req.user.id;

    const rankInfo = await userService.getUserRank(userId);

    return res.status(200).json({
      success: true,
      message: userProfileMessages.rankFetchedSuccess,
      data: rankInfo,
    });
  } catch (error) {
    console.error('Error fetching rank:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export {
  getPublicProfile,
  getGlobalLeaderboard,
  getCurrentUserProfile,
  updateProfile,
  getActivityCalendar,
  getUserRank,
};

export default {
  getPublicProfile,
  getGlobalLeaderboard,
  getCurrentUserProfile,
  updateProfile,
  getActivityCalendar,
  getUserRank,
};
