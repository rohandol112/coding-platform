/**
 * Problem Routes - Dashboard
 * Admin routes for problem management
 */

import express from 'express';
import problemController from '../../controllers/dashboard/problem.controller.js';
import { authenticateJWT } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { validate } from '../../middlewares/validate.js';
import {
  createProblemSchema,
  updateProblemSchema,
  createTestCaseSchema,
  updateTestCaseSchema,
  getProblemsSchema,
} from '../../validation/problem.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateJWT);
router.use(isAdmin);

// Problem CRUD
router.post('/', validate(createProblemSchema), problemController.createProblem);
router.get('/', validate(getProblemsSchema, 'query'), problemController.getProblems);
router.get('/:problemId', problemController.getProblem);
router.put('/:problemId', validate(updateProblemSchema), problemController.updateProblem);
router.delete('/:problemId', problemController.deleteProblem);

// Test Cases
router.post('/:problemId/testcases', validate(createTestCaseSchema), problemController.addTestCase);
router.get('/:problemId/testcases', problemController.getTestCases);
router.put('/testcases/:testCaseId', validate(updateTestCaseSchema), problemController.updateTestCase);
router.delete('/testcases/:testCaseId', problemController.deleteTestCase);

export default router;
