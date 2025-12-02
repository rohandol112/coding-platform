/**
 * Problem Controller - Dashboard
 * HTTP request handlers for problem management
 */

const problemService = require('../../services/dashboard/problem.service');
const { PROBLEM_MESSAGES } = require('../../constant/problem');

/**
 * Create problem
 */
const createProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problem = await problemService.createProblem(req.body, userId);

    res.status(201).json({
      success: true,
      message: PROBLEM_MESSAGES.CREATED,
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
      message: PROBLEM_MESSAGES.UPDATED,
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
      message: PROBLEM_MESSAGES.DELETED,
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
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      difficulty: req.query.difficulty,
      tags: req.query.tags,
      search: req.query.search,
      isPublic: req.query.isPublic,
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
      message: PROBLEM_MESSAGES.TEST_CASE_ADDED,
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
      message: PROBLEM_MESSAGES.TEST_CASE_UPDATED,
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
      message: PROBLEM_MESSAGES.TEST_CASE_DELETED,
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
