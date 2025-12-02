import express from 'express';
import { getAuthUrlController, googleCallbackController, googleTokenController } from '../../../../controllers/dashboard/auth/google/googleAuthController.js';

const router = express.Router();

/**
 * @route   GET /api/dashboard/auth/google/url
 * @desc    Get Google OAuth authorization URL for admin
 * @access  Public
 */
router.get('/url', getAuthUrlController);

/**
 * @route   GET /api/dashboard/auth/google/callback
 * @desc    Handle Google OAuth callback for admin
 * @access  Public
 */
router.get('/callback', googleCallbackController);

/**
 * @route   POST /api/dashboard/auth/google/token
 * @desc    Authenticate admin with Google ID token
 * @access  Public
 */
router.post('/token', googleTokenController);

export default router;
