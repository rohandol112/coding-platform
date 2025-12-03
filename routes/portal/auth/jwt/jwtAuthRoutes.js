import express from 'express';
import { registerController, loginController, profileController, changePasswordController } from '../../../../controllers/portal/auth/jwt/jwtAuthController.js';

const router = express.Router();

/**
 * @route   POST /api/portal/auth/jwt/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerController);

/**
 * @route   POST /api/portal/auth/jwt/login
 * @desc    Login user with email/username/phone and password
 * @access  Public
 */
router.post('/login', loginController);

/**
 * @route   GET /api/portal/auth/jwt/profile
 * @desc    Get authenticated user profile
 * @access  Private
 */
router.get('/profile', profileController);

/**
 * @route   PUT /api/portal/auth/jwt/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', changePasswordController);

/**
 * @route   POST /api/portal/auth/jwt/forgot-password
 * @desc    Request password reset email
 * @access  Public
 * @todo    Implement forgotPasswordController
 */
// router.post('/forgot-password', forgotPasswordController);

/**
 * @route   POST /api/portal/auth/jwt/reset-password
 * @desc    Reset password with token
 * @access  Public
 * @todo    Implement resetPasswordController
 */
// router.post('/reset-password', resetPasswordController);

export default router;
