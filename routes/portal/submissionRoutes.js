/**
 * @fileoverview Submission routes
 */

const express = require('express');
const { createSubmission, getSubmission, getUserSubmissions } = require('../../../controllers/portal/submissions/submissionController');
const { authenticate } = require('../../../middleware/authenticate');
const { validate } = require('../../../middleware/validate');
const { createSubmissionSchema, getSubmissionSchema } = require('../../../validation/submissionSchema');

const router = express.Router();

/**
 * POST /api/submissions
 * Create a new submission
 */
router.post(
  '/submissions',
  authenticate,
  validate(createSubmissionSchema),
  createSubmission
);

/**
 * GET /api/submissions/:submissionId
 * Get submission by ID
 */
router.get(
  '/submissions/:submissionId',
  authenticate,
  validate(getSubmissionSchema),
  getSubmission
);

/**
 * GET /api/submissions
 * Get user's submissions (with pagination)
 */
router.get(
  '/submissions',
  authenticate,
  getUserSubmissions
);

module.exports = router;
