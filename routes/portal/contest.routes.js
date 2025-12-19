/**
 * @fileoverview Portal Contest Routes
 * Routes for public contest endpoints
 */

import express from 'express';
import { authenticateJWT } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import {
  getContestListSchema,
  getContestBySlugSchema,
  contestIdSchema,
  leaderboardQuerySchema,
} from '../../validation/portalValidation.js';
import {
  getContests,
  getContestBySlug,
  registerForContest,
  unregisterFromContest,
  getContestLeaderboard,
  getUpcomingContests,
  getRunningContests,
  getMyContests,
} from '../../controllers/portal/contest/contestController.js';

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
 * @route   GET /api/portal/contests
 * @desc    Get all public contests with filters
 * @access  Public
 */
router.get(
  '/',
  validate(getContestListSchema, 'query'),
  getContests
);

/**
 * @route   GET /api/portal/contests/upcoming
 * @desc    Get upcoming contests
 * @access  Public
 */
router.get('/upcoming', getUpcomingContests);

/**
 * @route   GET /api/portal/contests/running
 * @desc    Get currently running contests
 * @access  Public
 */
router.get('/running', getRunningContests);

/**
 * @route   GET /api/portal/contests/my
 * @desc    Get user's registered contests
 * @access  Private
 */
router.get('/my', authenticateJWT, getMyContests);

/**
 * @route   GET /api/portal/contests/:slug
 * @desc    Get contest details by slug
 * @access  Public (optional auth for registration status)
 */
router.get(
  '/:slug',
  optionalAuth,
  validate(getContestBySlugSchema, 'params'),
  getContestBySlug
);

/**
 * @route   POST /api/portal/contests/:contestId/register
 * @desc    Register for a contest
 * @access  Private
 */
router.post(
  '/:contestId/register',
  authenticateJWT,
  validate(contestIdSchema, 'params'),
  registerForContest
);

/**
 * @route   DELETE /api/portal/contests/:contestId/register
 * @desc    Unregister from a contest
 * @access  Private
 */
router.delete(
  '/:contestId/register',
  authenticateJWT,
  validate(contestIdSchema, 'params'),
  unregisterFromContest
);

/**
 * @route   GET /api/portal/contests/:contestId/leaderboard
 * @desc    Get contest leaderboard
 * @access  Public
 */
router.get(
  '/:contestId/leaderboard',
  validate(contestIdSchema, 'params'),
  validate(leaderboardQuerySchema, 'query'),
  getContestLeaderboard
);

export default router;
