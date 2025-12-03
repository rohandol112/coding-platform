import express from 'express';
import { authenticateJWT } from '../../../middlewares/authenticateJWT.js';
import { isAdmin } from '../../../middlewares/isAdmin.js';
import { validate } from '../../../middlewares/validate.js';
import analyticsController from '../../../controllers/dashboard/analytics.controller.js';
import { getSubmissionStatsSchema } from '../../../validation/dashboard/analyticsValidation.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateJWT);
router.use(isAdmin);

// Analytics routes
router.get('/dashboard', analyticsController.getDashboardAnalytics);
router.get('/submissions', validate(getSubmissionStatsSchema, 'query'), analyticsController.getSubmissionStats);
router.get('/problems', analyticsController.getProblemStats);

export default router;
