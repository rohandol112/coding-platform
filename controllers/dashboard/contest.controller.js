/**
 * Contest Controller - Dashboard
 * HTTP request handlers for contest management
 */

const contestService = require('../../services/dashboard/contest.service');
const { contestMessages } = require('../../constant/contest');

/**
 * Create contest
 */
const createContest = async (req, res) => {
  try {
    const userId = req.user.id;
    const contest = await contestService.createContest(req.body, userId);

    res.status(201).json({
      success: true,
      message: contestMessages.created,
      data: contest,
    });
  } catch (error) {
    console.error('Create contest controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update contest
 */
const updateContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;
    const contest = await contestService.updateContest(contestId, req.body, userId);

    res.status(200).json({
      success: true,
      message: contestMessages.updated,
      data: contest,
    });
  } catch (error) {
    console.error('Update contest controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete contest
 */
const deleteContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;
    await contestService.deleteContest(contestId, userId);

    res.status(200).json({
      success: true,
      message: contestMessages.deleted,
    });
  } catch (error) {
    console.error('Delete contest controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get contest by ID
 */
const getContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const includeProblems = req.query.includeProblems === 'true';
    const contest = await contestService.getContestById(contestId, includeProblems);

    res.status(200).json({
      success: true,
      data: contest,
    });
  } catch (error) {
    console.error('Get contest controller error:', error);
    res.status(error.statusCode || 404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all contests
 */
const getContests = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 20, 100),
      status: req.query.status,
      type: req.query.type,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };

    const result = await contestService.getContests(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get contests controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add problem to contest
 */
const addProblem = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contestProblem = await contestService.addProblemToContest(contestId, req.body);

    res.status(201).json({
      success: true,
      message: contestMessages.problemAdded,
      data: contestProblem,
    });
  } catch (error) {
    console.error('Add problem controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Remove problem from contest
 */
const removeProblem = async (req, res) => {
  try {
    const { contestId, problemId } = req.params;
    await contestService.removeProblemFromContest(contestId, problemId);

    res.status(200).json({
      success: true,
      message: contestMessages.problemRemoved,
    });
  } catch (error) {
    console.error('Remove problem controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update contest status
 */
const updateStatus = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { status } = req.body;
    const contest = await contestService.updateContestStatus(contestId, status);

    res.status(200).json({
      success: true,
      message: contestMessages.updated,
      data: contest,
    });
  } catch (error) {
    console.error('Update status controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get contest participants
 */
const getParticipants = async (req, res) => {
  try {
    const { contestId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const participants = await contestService.getContestParticipants(contestId, page, limit);

    res.status(200).json({
      success: true,
      data: participants,
    });
  } catch (error) {
    console.error('Get participants controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get contest leaderboard
 */
const getLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
    const leaderboard = await contestService.getContestLeaderboard(contestId, page, limit);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Get leaderboard controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Clone contest
 */
const cloneContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { slug, title } = req.body;
    const userId = req.user.id;

    const clonedContest = await contestService.cloneContest(contestId, slug, title, userId);

    res.status(201).json({
      success: true,
      message: 'Contest cloned successfully',
      data: clonedContest,
    });
  } catch (error) {
    console.error('Clone contest controller error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createContest,
  updateContest,
  deleteContest,
  getContest,
  getContests,
  addProblem,
  removeProblem,
  updateStatus,
  getParticipants,
  getLeaderboard,
  cloneContest,
};
