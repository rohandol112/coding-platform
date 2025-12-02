/**
 * Contest Service - Dashboard
 * Handles contest management operations for administrators
 */

const axios = require('axios');
const { contestStatus, contestMessages } = require('../../../constant/contest');

const prismaServiceUrl = process.env.PRISMA_SERVICE_URL || 'http://localhost:3001';

/**
 * Create a new contest
 */
const createContest = async (contestData, createdBy) => {
  try {
    const response = await axios.post(
      `${prismaServiceUrl}/api/contests`,
      {
        ...contestData,
        createdBy,
        status: contestStatus.draft,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    console.error('Create contest error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create contest');
  }
};

/**
 * Update contest
 */
const updateContest = async (contestId, updateData, userId) => {
  try {
    // Get current contest to check status
    const current = await getContestById(contestId);

    if (current.status === contestStatus.running || current.status === contestStatus.ended) {
      throw new Error(contestMessages.cannotModifyStarted);
    }

    const response = await axios.put(
      `${prismaServiceUrl}/api/contests/${contestId}`,
      updateData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    console.error('Update contest error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Delete contest
 */
const deleteContest = async (contestId, userId) => {
  try {
    const contest = await getContestById(contestId);

    if (contest.status === contestStatus.running) {
      throw new Error(contestMessages.cannotDeleteStarted);
    }

    await axios.delete(`${prismaServiceUrl}/api/contests/${contestId}`);
  } catch (error) {
    console.error('Delete contest error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Get contest by ID
 */
const getContestById = async (contestId, includeProblems = false) => {
  try {
    const params = includeProblems ? '?includeProblems=true' : '';
    const response = await axios.get(
      `${prismaServiceUrl}/api/contests/${contestId}${params}`
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(contestMessages.notFound);
    }
    throw new Error(error.response?.data?.message || 'Failed to get contest');
  }
};

/**
 * Get all contests with filters
 */
const getContests = async (filters) => {
  try {
    const params = new URLSearchParams({
      page: filters.page?.toString() || '1',
      limit: filters.limit?.toString() || '20',
    });

    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await axios.get(
      `${prismaServiceUrl}/api/contests?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error('Get contests error:', error.response?.data || error.message);
    throw new Error(contestMessages.fetchContestsFailed);
  }
};

/**
 * Add problem to contest
 */
const addProblemToContest = async (contestId, problemData) => {
  try {
    const contest = await getContestById(contestId);

    if (contest.status === contestStatus.running || contest.status === contestStatus.ended) {
      throw new Error(contestMessages.cannotModifyStarted);
    }

    const response = await axios.post(
      `${prismaServiceUrl}/api/contests/${contestId}/problems`,
      problemData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    console.error('Add problem to contest error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Remove problem from contest
 */
const removeProblemFromContest = async (contestId, problemId) => {
  try {
    await axios.delete(
      `${prismaServiceUrl}/api/contests/${contestId}/problems/${problemId}`
    );
  } catch (error) {
    console.error('Remove problem from contest error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to remove problem');
  }
};

/**
 * Update contest status
 */
const updateContestStatus = async (contestId, status) => {
  try {
    const response = await axios.patch(
      `${prismaServiceUrl}/api/contests/${contestId}/status`,
      { status },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    console.error('Update contest status error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update status');
  }
};

/**
 * Get contest participants
 */
const getContestParticipants = async (contestId, page = 1, limit = 50) => {
  try {
    const response = await axios.get(
      `${prismaServiceUrl}/api/contests/${contestId}/participants?page=${page}&limit=${limit}`
    );

    return response.data;
  } catch (error) {
    console.error('Get participants error:', error.response?.data || error.message);
    throw new Error(contestMessages.fetchParticipantsFailed);
  }
};

/**
 * Get contest leaderboard
 */
const getContestLeaderboard = async (contestId, page = 1, limit = 100) => {
  try {
    const response = await axios.get(
      `${prismaServiceUrl}/api/contests/${contestId}/leaderboard?page=${page}&limit=${limit}`
    );

    return response.data;
  } catch (error) {
    console.error('Get leaderboard error:', error.response?.data || error.message);
    throw new Error(contestMessages.fetchLeaderboardFailed);
  }
};

module.exports = {
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
};
