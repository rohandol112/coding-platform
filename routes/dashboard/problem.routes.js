/**
 * Problem Routes - Dashboard
 * Admin routes for problem management
 */

const express = require('express');
const router = express.Router();
const problemController = require('../../controllers/dashboard/problem.controller');
const { authenticateJWT } = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/isAdmin');
const { validate } = require('../../middlewares/validate');
const {
  createProblemSchema,
  updateProblemSchema,
  createTestCaseSchema,
  updateTestCaseSchema,
  getProblemsSchema,
} = require('../../validation/problem');

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

module.exports = router;
