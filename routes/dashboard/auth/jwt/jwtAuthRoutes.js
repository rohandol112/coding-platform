import express from 'express';
import { registerController, loginController, profileController, forgotPasswordController, resetPasswordController } from '../../../../controllers/dashboard/auth/jwt/jwtAuthController.js';

const router = express.Router();

/**
 * @route   POST /api/dashboard/auth/jwt/register
 * @desc    Register a new admin user
 * @access  Public
 */
router.post('/register', registerController);

/**
 * @route   POST /api/dashboard/auth/jwt/login
 * @desc    Login admin user
 * @access  Public
 */
router.post('/login', loginController);

/**
 * @route   GET /api/dashboard/auth/jwt/profile
 * @desc    Get authenticated admin profile
 * @access  Private
 */
router.get('/profile', profileController);

/**
 * @route   POST /api/dashboard/auth/jwt/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordController);

/**
 * @route   POST /api/dashboard/auth/jwt/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', resetPasswordController);

export default router;
