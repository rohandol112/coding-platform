/**
 * Contest Routes - Dashboard
 * Admin routes for contest management
 */

import express from 'express';
import contestController from '../../controllers/dashboard/contest.controller.js';
import { authenticateJWT } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { validate } from '../../middlewares/validate.js';
import {
  createContestSchema,
  updateContestSchema,
  addProblemToContestSchema,
  updateContestStatusSchema,
  getContestsSchema,
} from '../../validation/contest.js';

const router = express.Router();

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

// Contest Clone
router.post('/:contestId/clone', contestController.cloneContest);

export default router;
