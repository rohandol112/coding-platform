/**
 * @fileoverview Portal Editorial Routes
 * Routes for editorial and hint endpoints
 */

import express from 'express';
import { authenticateJWT } from '../../middlewares/auth.js';
import {
  getEditorial,
  getHints,
  unlockHint,
} from '../../controllers/portal/editorial/editorialController.js';

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
 * @route   GET /api/portal/editorials/:problemId
 * @desc    Get editorial for a problem
 * @access  Public
 */
router.get('/:problemId', optionalAuth, getEditorial);

/**
 * @route   GET /api/portal/editorials/:problemId/hints
 * @desc    Get hints list for a problem (without content)
 * @access  Public
 */
router.get('/:problemId/hints', optionalAuth, getHints);

/**
 * @route   GET /api/portal/hints/:hintId/unlock
 * @desc    Unlock (get content of) a specific hint
 * @access  Public (but penalty applies)
 */
router.get('/hints/:hintId/unlock', optionalAuth, unlockHint);

export default router;
