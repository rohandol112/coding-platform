import express from 'express';
import { sendOtpController, verifyOtpController } from '../../../../controllers/portal/auth/phone/phoneAuthController.js';

const router = express.Router();

/**
 * @route   POST /api/portal/auth/phone/send-otp
 * @desc    Send OTP to phone number
 * @access  Public
 */
router.post('/send-otp', sendOtpController);

/**
 * @route   POST /api/portal/auth/phone/verify-otp
 * @desc    Verify OTP and login/register user
 * @access  Public
 */
router.post('/verify-otp', verifyOtpController);

export default router;
