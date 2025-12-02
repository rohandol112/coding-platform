import express from 'express';
import { getAuthUrlController, googleCallbackController, googleTokenController } from '../../../../controllers/portal/auth/google/googleAuthController.js';

const router = express.Router();

/**
 * @route   GET /api/portal/auth/google/url
 * @desc    Get Google OAuth authorization URL
 * @access  Public
 */
router.get('/url', getAuthUrlController);

/**
 * @route   GET /api/portal/auth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.get('/callback', googleCallbackController);

/**
 * @route   POST /api/portal/auth/google/token
 * @desc    Authenticate with Google ID token
 * @access  Public
 */
router.post('/token', googleTokenController);

export default router;
