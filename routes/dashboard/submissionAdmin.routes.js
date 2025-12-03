import express from 'express';
import { authenticateJWT } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { validate } from '../../middlewares/validate.js';
import submissionAdminController from '../../controllers/dashboard/submissionAdmin.controller.js';
import { getSubmissionsSchema } from '../../validation/dashboard/submissionAdminValidation.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateJWT);
router.use(isAdmin);

// Submission monitoring routes
router.get('/', validate(getSubmissionsSchema, 'query'), submissionAdminController.getSubmissions);
router.get('/:submissionId', submissionAdminController.getSubmission);
router.delete('/:submissionId', submissionAdminController.deleteSubmission);
router.post('/:submissionId/rejudge', submissionAdminController.rejudgeSubmission);

export default router;
