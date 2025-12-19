/**
 * @fileoverview Portal Submission Controller
 * Handles HTTP requests for user submission endpoints
 * Thin layer - delegates business logic to services
 */

import submissionService from '../../../services/portal/submission.service.js';
import { submissionMessages, portalMessages } from '../../../constant/portalMessages.js';

/**
 * Submit solution for a problem
 * POST /api/portal/submissions
 */
async function createSubmission(req, res) {
  try {
    const userId = req.user.id;
    const { problemId, language, code, contestId } = req.body;

    const submission = await submissionService.createSubmission(userId, {
      problemId,
      language,
      code,
      contestId,
    });

    return res.status(201).json({
      success: true,
      message: submissionMessages.submissionCreatedSuccess,
      data: submission,
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      data: error.data,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get submission by ID
 * GET /api/portal/submissions/:submissionId
 */
async function getSubmission(req, res) {
  try {
    const { submissionId } = req.params;
    const userId = req.user?.id || null;

    const submission = await submissionService.getSubmissionById(submissionId, userId);

    return res.status(200).json({
      success: true,
      message: submissionMessages.submissionFetchedSuccess,
      data: submission,
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get user's submissions
 * GET /api/portal/submissions/my
 */
async function getMySubmissions(req, res) {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      problemId,
      contestId,
      status,
      language,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const result = await submissionService.getUserSubmissions(userId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      problemId,
      contestId,
      status,
      language,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: submissionMessages.submissionsFetchedSuccess,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get submissions for a problem
 * GET /api/portal/problems/:problemId/submissions
 */
async function getProblemSubmissions(req, res) {
  try {
    const { problemId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await submissionService.getProblemSubmissions(problemId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    return res.status(200).json({
      success: true,
      message: submissionMessages.submissionsFetchedSuccess,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching problem submissions:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get user's submission statistics
 * GET /api/portal/submissions/stats
 */
async function getSubmissionStats(req, res) {
  try {
    const userId = req.user.id;

    const stats = await submissionService.getUserSubmissionStats(userId);

    return res.status(200).json({
      success: true,
      message: submissionMessages.statsFetchedSuccess,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching submission stats:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get user's best submission for a problem
 * GET /api/portal/problems/:problemId/best
 */
async function getBestSubmission(req, res) {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;

    const best = await submissionService.getBestSubmission(userId, problemId);

    return res.status(200).json({
      success: true,
      message: submissionMessages.bestSubmissionFetchedSuccess,
      data: best,
    });
  } catch (error) {
    console.error('Error fetching best submission:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Run code (without judging against test cases)
 * POST /api/portal/submissions/run
 */
async function runCode(req, res) {
  try {
    const userId = req.user.id;
    const { language, code, stdin } = req.body;

    const result = await submissionService.runCode(userId, { language, code, stdin });

    return res.status(200).json({
      success: true,
      message: submissionMessages.codeExecutionQueued,
      data: result,
    });
  } catch (error) {
    console.error('Error running code:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      data: error.data,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export {
  createSubmission,
  getSubmission,
  getMySubmissions,
  getProblemSubmissions,
  getSubmissionStats,
  getBestSubmission,
  runCode,
};

export default {
  createSubmission,
  getSubmission,
  getMySubmissions,
  getProblemSubmissions,
  getSubmissionStats,
  getBestSubmission,
  runCode,
};
