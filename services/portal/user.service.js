/**
 * @fileoverview Portal User Service
 * Business logic for portal user profile operations
 * Delegates to repository for data access
 */

import portalUserRepository from '../../../library/domain/portal/portalUserRepository.js';
import { userProfileMessages } from '../../../constant/portalMessages.js';

/**
 * Get public user profile by username
 * @param {string} username - Username
 * @returns {Promise<Object>} User profile
 * @throws {Error} If user not found
 */
async function getPublicProfile(username) {
  const profile = await portalUserRepository.getPublicProfile(username);

  if (!profile) {
    const error = new Error(userProfileMessages.userNotFound);
    error.statusCode = 404;
    throw error;
  }

  return profile;
}

/**
 * Get global leaderboard
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Leaderboard data
 */
async function getGlobalLeaderboard(options) {
  const result = await portalUserRepository.getGlobalLeaderboard(options);

  return {
    timeframe: options.timeframe,
    ...result,
  };
}

/**
 * Get current user's profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile
 * @throws {Error} If user not found
 */
async function getCurrentUserProfile(userId) {
  const profile = await portalUserRepository.getCurrentUserProfile(userId);

  if (!profile) {
    const error = new Error(userProfileMessages.userNotFound);
    error.statusCode = 404;
    throw error;
  }

  return profile;
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile update data
 * @returns {Promise<Object>} Updated profile
 */
async function updateProfile(userId, profileData) {
  return await portalUserRepository.updateProfile(userId, profileData);
}

/**
 * Get user's activity calendar
 * @param {string} userId - User ID
 * @param {number} months - Number of months to fetch
 * @returns {Promise<Array>} Activity data
 */
async function getActivityCalendar(userId, months) {
  const cappedMonths = Math.min(months, 24);
  return await portalUserRepository.getActivityCalendar(userId, cappedMonths);
}

/**
 * Get user's global rank
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Rank info
 */
async function getUserRank(userId) {
  return await portalUserRepository.getUserRank(userId);
}

export default {
  getPublicProfile,
  getGlobalLeaderboard,
  getCurrentUserProfile,
  updateProfile,
  getActivityCalendar,
  getUserRank,
};

export {
  getPublicProfile,
  getGlobalLeaderboard,
  getCurrentUserProfile,
  updateProfile,
  getActivityCalendar,
  getUserRank,
};
