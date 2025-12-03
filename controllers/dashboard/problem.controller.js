/**
 * Problem Controller - Dashboard
 * HTTP request handlers for problem management
 */

const problemService = require('../../services/dashboard/problem.service');
const { problemMessages } = require('../../constant/problem');

/**
 * Create problem
 */
const createProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problem = await problemService.createProblem(req.body, userId);

    res.status(201).json({
      success: true,
      message: problemMessages.created,
      data: problem,
    });
  } catch (error) {
    console.error('Create problem controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update problem
 */
const updateProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;
    const problem = await problemService.updateProblem(problemId, req.body, userId);

    res.status(200).json({
      success: true,
      message: problemMessages.updated,
      data: problem,
    });
  } catch (error) {
    console.error('Update problem controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete problem
 */
const deleteProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;
    await problemService.deleteProblem(problemId, userId);

    res.status(200).json({
      success: true,
      message: problemMessages.deleted,
    });
  } catch (error) {
    console.error('Delete problem controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get problem by ID
 */
const getProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const includeTestCases = req.query.includeTestCases === 'true';
    const problem = await problemService.getProblemById(problemId, includeTestCases);

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error('Get problem controller error:', error);
    res.status(error.statusCode || 404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all problems
 */
const getProblems = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page, 10) || 1,
      limit: Math.min(parseInt(req.query.limit, 10) || 20, 100),
      difficulty: req.query.difficulty,
      tags: req.query.tags,
      search: req.query.search,
      isPublic: req.query.isPublic === 'true' ? true : req.query.isPublic === 'false' ? false : undefined,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };

    const result = await problemService.getProblems(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get problems controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add test case
 */
const addTestCase = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;
    const testCase = await problemService.addTestCase(problemId, req.body, userId);

    res.status(201).json({
      success: true,
      message: problemMessages.testCaseAdded,
      data: testCase,
    });
  } catch (error) {
    console.error('Add test case controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update test case
 */
const updateTestCase = async (req, res) => {
  try {
    const { testCaseId } = req.params;
    const userId = req.user.id;
    const testCase = await problemService.updateTestCase(testCaseId, req.body, userId);

    res.status(200).json({
      success: true,
      message: problemMessages.testCaseUpdated,
      data: testCase,
    });
  } catch (error) {
    console.error('Update test case controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete test case
 */
const deleteTestCase = async (req, res) => {
  try {
    const { testCaseId } = req.params;
    const userId = req.user.id;
    await problemService.deleteTestCase(testCaseId, userId);

    res.status(200).json({
      success: true,
      message: problemMessages.testCaseDeleted,
    });
  } catch (error) {
    console.error('Delete test case controller error:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get test cases
 */
const getTestCases = async (req, res) => {
  try {
    const { problemId } = req.params;
    const includeHidden = req.query.includeHidden === 'true';
    const testCases = await problemService.getTestCases(problemId, includeHidden);

    res.status(200).json({
      success: true,
      data: testCases,
    });
  } catch (error) {
    console.error('Get test cases controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblem,
  getProblems,
  addTestCase,
  updateTestCase,
  deleteTestCase,
  getTestCases,
};
