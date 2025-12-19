/**
 * @fileoverview Portal Submission Routes
 * Routes for user submission endpoints
 */

import express from 'express';
import { authenticateJWT } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import {
  createSubmissionSchema,
  getSubmissionByIdSchema,
  getSubmissionListSchema,
  runCodeSchema,
} from '../../validation/portalValidation.js';
import {
  createSubmission,
  getSubmission,
  getMySubmissions,
  getProblemSubmissions,
  getSubmissionStats,
  getBestSubmission,
  runCode,
} from '../../controllers/portal/submission/submissionController.js';

const router = express.Router();

/**
 * Optional authentication middleware
 * Sets req.user if token provided, but doesn't require it
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return authenticateJWT(req, res, next);
  }
  next();
};

/**
 * @route   POST /api/portal/submissions
 * @desc    Submit a solution for a problem
 * @access  Private
 */
router.post(
  '/',
  authenticateJWT,
  validate(createSubmissionSchema, 'body'),
  createSubmission
);

/**
 * @route   POST /api/portal/submissions/run
 * @desc    Run code without judging
 * @access  Private
 */
router.post(
  '/run',
  authenticateJWT,
  validate(runCodeSchema, 'body'),
  runCode
);

/**
 * @route   GET /api/portal/submissions/my
 * @desc    Get current user's submissions
 * @access  Private
 */
router.get(
  '/my',
  authenticateJWT,
  validate(getSubmissionListSchema, 'query'),
  getMySubmissions
);

/**
 * @route   GET /api/portal/submissions/stats
 * @desc    Get current user's submission statistics
 * @access  Private
 */
router.get(
  '/stats',
  authenticateJWT,
  getSubmissionStats
);

/**
 * @route   GET /api/portal/submissions/:submissionId
 * @desc    Get submission by ID
 * @access  Public (limited info) / Private (full info for owner)
 */
router.get(
  '/:submissionId',
  optionalAuth,
  validate(getSubmissionByIdSchema, 'params'),
  getSubmission
);

export default router;
