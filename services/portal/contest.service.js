/**
 * @fileoverview Portal Contest Service
 * Business logic for portal contest operations
 * Delegates to repository for data access
 */

import portalContestRepository from '../../../library/domain/portal/portalContestRepository.js';
import prismaClient from '../../../library/database/prismaClient.js';
import { contestMessages } from '../../../constant/portalMessages.js';

/**
 * Get public contests with filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Paginated contests
 */
async function getPublicContests(filters) {
  return await portalContestRepository.findPublicContests(filters);
}

/**
 * Get contest details by slug
 * @param {string} slug - Contest slug
 * @param {string|null} userId - User ID for registration status
 * @returns {Promise<Object>} Contest details
 * @throws {Error} If contest not found
 */
async function getContestBySlug(slug, userId = null) {
  const contest = await portalContestRepository.findPublicContestBySlug(slug, userId);

  if (!contest) {
    const error = new Error(contestMessages.contestNotFound);
    error.statusCode = 404;
    throw error;
  }

  return contest;
}

/**
 * Register user for a contest
 * @param {string} contestId - Contest ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Registration details
 * @throws {Error} If registration fails
 */
async function registerForContest(contestId, userId) {
  // Check if contest exists
  const contest = await prismaClient.contest.findUnique({
    where: { id: contestId },
  });

  if (!contest) {
    const error = new Error(contestMessages.contestNotFound);
    error.statusCode = 404;
    throw error;
  }

  // Check if contest is open for registration
  if (!contest.isPublic) {
    const error = new Error(contestMessages.contestNotPublic);
    error.statusCode = 403;
    throw error;
  }

  // Check registration deadline
  if (contest.registrationDeadline && new Date() > contest.registrationDeadline) {
    const error = new Error(contestMessages.registrationClosed);
    error.statusCode = 400;
    throw error;
  }

  // Check if contest has ended
  if (contest.status === 'ENDED' || contest.status === 'CANCELLED') {
    const error = new Error(contestMessages.contestEnded);
    error.statusCode = 400;
    throw error;
  }

  // Check max participants
  if (contest.maxParticipants) {
    const currentCount = await prismaClient.contestParticipant.count({
      where: { contestId },
    });
    if (currentCount >= contest.maxParticipants) {
      const error = new Error(contestMessages.contestFull);
      error.statusCode = 400;
      throw error;
    }
  }

  // Check if already registered
  const isRegistered = await portalContestRepository.isUserRegistered(contestId, userId);
  if (isRegistered) {
    const error = new Error(contestMessages.alreadyRegistered);
    error.statusCode = 409;
    throw error;
  }

  // Register user
  const participation = await portalContestRepository.registerForContest(contestId, userId);

  return {
    contestId,
    userId,
    contestTitle: participation.contest.title,
    startTime: participation.contest.startTime,
    registeredAt: participation.registeredAt,
  };
}

/**
 * Unregister user from a contest
 * @param {string} contestId - Contest ID
 * @param {string} userId - User ID
 * @throws {Error} If unregistration fails
 */
async function unregisterFromContest(contestId, userId) {
  // Check if contest exists
  const contest = await prismaClient.contest.findUnique({
    where: { id: contestId },
  });

  if (!contest) {
    const error = new Error(contestMessages.contestNotFound);
    error.statusCode = 404;
    throw error;
  }

  // Check if contest has started
  if (new Date() >= contest.startTime) {
    const error = new Error(contestMessages.contestStarted);
    error.statusCode = 400;
    throw error;
  }

  // Check if registered
  const isRegistered = await portalContestRepository.isUserRegistered(contestId, userId);
  if (!isRegistered) {
    const error = new Error(contestMessages.notRegistered);
    error.statusCode = 404;
    throw error;
  }

  await portalContestRepository.unregisterFromContest(contestId, userId);
}

/**
 * Get contest leaderboard
 * @param {string} contestId - Contest ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} Leaderboard data
 * @throws {Error} If contest not found
 */
async function getContestLeaderboard(contestId, options) {
  // Check if contest exists
  const contest = await prismaClient.contest.findUnique({
    where: { id: contestId },
    select: { id: true, title: true, status: true },
  });

  if (!contest) {
    const error = new Error(contestMessages.contestNotFound);
    error.statusCode = 404;
    throw error;
  }

  const result = await portalContestRepository.getContestLeaderboard(contestId, options);

  return {
    contest: {
      id: contest.id,
      title: contest.title,
      status: contest.status,
    },
    ...result,
  };
}

/**
 * Get upcoming contests
 * @param {number} limit - Number of contests to return
 * @returns {Promise<Array>} Upcoming contests
 */
async function getUpcomingContests(limit) {
  const contests = await portalContestRepository.getUpcomingContests(limit);

  return contests.map(c => ({
    ...c,
    participantCount: c._count?.participants || 0,
    _count: undefined,
  }));
}

/**
 * Get currently running contests
 * @returns {Promise<Array>} Running contests
 */
async function getRunningContests() {
  const contests = await portalContestRepository.getRunningContests();

  return contests.map(c => ({
    ...c,
    participantCount: c._count?.participants || 0,
    problemCount: c._count?.problems || 0,
    _count: undefined,
  }));
}

/**
 * Get user's registered contests
 * @param {string} userId - User ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} User's contests
 */
async function getUserContests(userId, options) {
  return await portalContestRepository.getUserContests(userId, options);
}

export default {
  getPublicContests,
  getContestBySlug,
  registerForContest,
  unregisterFromContest,
  getContestLeaderboard,
  getUpcomingContests,
  getRunningContests,
  getUserContests,
};

export {
  getPublicContests,
  getContestBySlug,
  registerForContest,
  unregisterFromContest,
  getContestLeaderboard,
  getUpcomingContests,
  getRunningContests,
  getUserContests,
};
