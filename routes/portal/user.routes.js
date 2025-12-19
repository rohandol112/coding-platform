/**
 * @fileoverview Portal User Routes
 * Routes for user profile and leaderboard endpoints
 */

import express from 'express';
import { authenticateJWT } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import {
  getUserByUsernameSchema,
  updateProfileSchema,
  activityCalendarSchema,
} from '../../validation/portalValidation.js';
import {
  getPublicProfile,
  getCurrentUserProfile,
  updateProfile,
  getActivityCalendar,
  getUserRank,
} from '../../controllers/portal/user/userController.js';

const router = express.Router();

/**
 * @route   GET /api/portal/users/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', authenticateJWT, getCurrentUserProfile);

/**
 * @route   PUT /api/portal/users/me
 * @desc    Update current user's profile
 * @access  Private
 */
router.put(
  '/me',
  authenticateJWT,
  validate(updateProfileSchema, 'body'),
  updateProfile
);

/**
 * @route   GET /api/portal/users/me/activity
 * @desc    Get user's activity calendar
 * @access  Private
 */
router.get(
  '/me/activity',
  authenticateJWT,
  validate(activityCalendarSchema, 'query'),
  getActivityCalendar
);

/**
 * @route   GET /api/portal/users/me/rank
 * @desc    Get user's global rank
 * @access  Private
 */
router.get('/me/rank', authenticateJWT, getUserRank);

/**
 * @route   GET /api/portal/users/:username
 * @desc    Get public profile by username
 * @access  Public
 */
router.get(
  '/:username',
  validate(getUserByUsernameSchema, 'params'),
  getPublicProfile
);

export default router;
