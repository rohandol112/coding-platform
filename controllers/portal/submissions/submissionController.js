/**
 * @fileoverview Submission controller for creating and retrieving submissions
 */

const submissionService = require('../../../services/portal/submissions/submissionService');
const { httpMessages } = require('../../../constant/messages');

/** @typedef {import('../../../types/submissions').CreateSubmissionRequest} CreateSubmissionRequest */
/** @typedef {import('../../../types/submissions').CreateSubmissionResponse} CreateSubmissionResponse */
/** @typedef {import('../../../types/submissions').SubmissionResult} SubmissionResult */

/**
 * Create a new submission
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
async function createSubmission(req, res) {
  try {
    const userId = req.user.id;
    const submissionData = req.body;

    const result = await submissionService.createSubmission(userId, submissionData);

    res.status(202).json(result);
  } catch (error) {
    console.error('Failed to create submission:', error);

    if (error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message: error.message,
        remaining: error.remaining,
      });
    }

    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: httpMessages.internalServerError,
    });
  }
}

/**
 * Get submission by ID
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
async function getSubmission(req, res) {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const submission = await submissionService.getSubmissionById(submissionId, userId);

    res.status(200).json(submission);
  } catch (error) {
    console.error('Failed to get submission:', error);

    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.statusCode === 403) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: httpMessages.internalServerError,
    });
  }
}

/**
 * Get user's submissions (with pagination)
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
async function getUserSubmissions(req, res) {
  try {
    const userId = req.user.id;
    const { page, limit, problemId, status } = req.query;

    const submissions = await submissionService.getUserSubmissions(userId, {
      page,
      limit,
      problemId,
      status,
    });

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Failed to get user submissions:', error);

    res.status(500).json({
      success: false,
      message: httpMessages.internalServerError,
    });
  }
}

module.exports = {
  createSubmission,
  getSubmission,
  getUserSubmissions,
};
