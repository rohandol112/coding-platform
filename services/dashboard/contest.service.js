/**
 * Contest Service - Dashboard
 * Thin wrapper that delegates to domain use cases
 */

import {
  createContestUseCase,
  updateContestUseCase,
  deleteContestUseCase,
  getContestUseCase,
  getContestsUseCase,
  addProblemToContestUseCase,
  removeProblemFromContestUseCase,
  updateContestStatusUseCase,
  getContestParticipantsUseCase,
  getContestLeaderboardUseCase,
  cloneContestUseCase,
} from '../../library/domain/contest/contestUseCase.js';
import kafkaService from '../messaging/kafkaService.js';

/**
 * Create a new contest (delegates to use case)
 */
const createContest = async (contestData, createdBy) => {
  return await createContestUseCase.execute(contestData, createdBy);
};

/**
 * Update contest (delegates to use case)
 */
const updateContest = async (contestId, updateData, userId) => {
  return await updateContestUseCase.execute(contestId, updateData, userId);
};

/**
 * Delete contest (delegates to use case)
 */
const deleteContest = async (contestId, userId) => {
  return await deleteContestUseCase.execute(contestId, userId);
};

/**
 * Get contest by ID (delegates to use case)
 */
const getContestById = async (contestId, includeProblems = false) => {
  return await getContestUseCase.execute(contestId, { includeProblems });
};

/**
 * Get all contests with filters (delegates to use case)
 */
const getContests = async (filters) => {
  return await getContestsUseCase.execute(filters);
};

/**
 * Add problem to contest (delegates to use case)
 */
const addProblemToContest = async (contestId, problemData) => {
  return await addProblemToContestUseCase.execute(contestId, problemData);
};

/**
 * Remove problem from contest (delegates to use case)
 */
const removeProblemFromContest = async (contestId, problemId) => {
  return await removeProblemFromContestUseCase.execute(contestId, problemId);
};

/**
 * Update contest status (delegates to use case)
 */
const updateContestStatus = async (contestId, status) => {
  return await updateContestStatusUseCase.execute(contestId, status);
};

/**
 * Get contest participants (delegates to use case)
 */
const getContestParticipants = async (contestId, page = 1, limit = 50) => {
  return await getContestParticipantsUseCase.execute(contestId, { page, limit });
};

/**
 * Get contest leaderboard (delegates to use case)
 */
const getContestLeaderboard = async (contestId, page = 1, limit = 100) => {
  return await getContestLeaderboardUseCase.execute(contestId, { page, limit });
};

/**
 * Clone contest (delegates to use case)
 */
const cloneContest = async (contestId, newSlug, newTitle, userId) => {
  return await cloneContestUseCase.execute(contestId, newSlug, newTitle, userId);
};

export default {
  createContest,
  updateContest,
  deleteContest,
  getContestById,
  getContests,
  addProblemToContest,
  removeProblemFromContest,
  updateContestStatus,
  getContestParticipants,
  getContestLeaderboard,
  cloneContest,
};
