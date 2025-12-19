/**
 * @fileoverview Portal Leaderboard Routes
 * Routes for global leaderboard endpoints
 */

import express from 'express';
import { validate } from '../../middlewares/validate.js';
import { globalLeaderboardSchema } from '../../validation/portalValidation.js';
import { getGlobalLeaderboard } from '../../controllers/portal/user/userController.js';

const router = express.Router();

/**
 * @route   GET /api/portal/leaderboard
 * @desc    Get global leaderboard
 * @access  Public
 */
router.get(
  '/',
  validate(globalLeaderboardSchema, 'query'),
  getGlobalLeaderboard
);

export default router;
