import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { libraryMessages } from '../constant/messages.js';

/**
 * @typedef {import('../types/index.js').EmailServiceConfig} EmailServiceConfig
 */

dotenv.config();

if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error(libraryMessages.missingEmailEnv);
}

const transporter = nodemailer.createTransport({ host: process.env.EMAIL_HOST, port: parseInt(process.env.EMAIL_PORT), secure: process.env.EMAIL_SECURE === 'true', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD } });

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} firstName - User's first name
 * @returns {Promise<{success: boolean}>} Success status
 * @throws {Error} If email sending fails
 */
export const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const mailOptions = { from: `"${process.env.EMAIL_FROM_NAME || 'Coding Platform'}" <${process.env.EMAIL_USER}>`, to: email, subject: 'Password Reset Request', html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h2>Password Reset Request</h2><p>Hi ${firstName},</p><p>You requested to reset your password. Click the button below to reset it:</p><div style="text-align: center; margin: 30px 0;"><a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></div><p>Or copy and paste this link in your browser:</p><p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p><p>This link will expire in 1 hour.</p><p>If you didn't request a password reset, please ignore this email.</p><p>Best regards,<br>Coding Platform Team</p></div>` };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send password reset email:', error.message);
    throw new Error(libraryMessages.emailSendFailed);
  }
};
