/**
 * Contest Routes - Dashboard
 * Admin routes for contest management
 */

const express = require('express');
const router = express.Router();
const contestController = require('../../controllers/dashboard/contest.controller');
const { authenticateJWT } = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/isAdmin');
const { validate } = require('../../middlewares/validate');
const {
  createContestSchema,
  updateContestSchema,
  addProblemToContestSchema,
  updateContestStatusSchema,
  getContestsSchema,
} = require('../../validation/contest');

// Apply authentication and admin middleware to all routes
router.use(authenticateJWT);
router.use(isAdmin);

// Contest CRUD
router.post('/', validate(createContestSchema), contestController.createContest);
router.get('/', validate(getContestsSchema, 'query'), contestController.getContests);
router.get('/:contestId', contestController.getContest);
router.put('/:contestId', validate(updateContestSchema), contestController.updateContest);
router.delete('/:contestId', contestController.deleteContest);

// Contest Problems
router.post('/:contestId/problems', validate(addProblemToContestSchema), contestController.addProblem);
router.delete('/:contestId/problems/:problemId', contestController.removeProblem);

// Contest Status
router.patch('/:contestId/status', validate(updateContestStatusSchema), contestController.updateStatus);

// Contest Participants & Leaderboard
router.get('/:contestId/participants', contestController.getParticipants);
router.get('/:contestId/leaderboard', contestController.getLeaderboard);

module.exports = router;
