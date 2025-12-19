/**
 * @fileoverview Portal Problem Routes
 * Routes for public problem endpoints
 */

import express from 'express';
import { authenticateJWT } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import {
  getProblemListSchema,
  getProblemBySlugSchema,
} from '../../validation/portalValidation.js';
import {
  getProblems,
  getProblemBySlug,
  getPopularTags,
  getSolvedProblems,
} from '../../controllers/portal/problem/problemController.js';

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
 * @route   GET /api/portal/problems
 * @desc    Get all public problems with filters
 * @access  Public (optional auth for solved status)
 */
router.get(
  '/',
  optionalAuth,
  validate(getProblemListSchema, 'query'),
  getProblems
);

/**
 * @route   GET /api/portal/problems/tags
 * @desc    Get popular problem tags
 * @access  Public
 */
router.get('/tags', getPopularTags);

/**
 * @route   GET /api/portal/problems/solved
 * @desc    Get user's solved problem IDs
 * @access  Private
 */
router.get('/solved', authenticateJWT, getSolvedProblems);

/**
 * @route   GET /api/portal/problems/:slug
 * @desc    Get problem details by slug
 * @access  Public (optional auth for user-specific data)
 */
router.get(
  '/:slug',
  optionalAuth,
  validate(getProblemBySlugSchema, 'params'),
  getProblemBySlug
);

export default router;
