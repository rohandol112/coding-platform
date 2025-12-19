/**
 * @fileoverview Portal Submission Service
 * Business logic for portal submission operations
 * Delegates to repository for data access
 */

import portalSubmissionRepository from '../../../library/domain/portal/portalSubmissionRepository.js';
import portalContestRepository from '../../../library/domain/portal/portalContestRepository.js';
import prismaClient from '../../../library/database/prismaClient.js';
import { submissionMessages, contestMessages } from '../../../constant/portalMessages.js';

/**
 * Create a new submission
 * @param {string} userId - User ID
 * @param {Object} submissionData - Submission data
 * @returns {Promise<Object>} Created submission
 * @throws {Error} If submission fails
 */
async function createSubmission(userId, submissionData) {
  const { problemId, language, code, contestId } = submissionData;

  // Check rate limit
  const rateLimit = await portalSubmissionRepository.checkRateLimit(userId, 1, 10);
  if (!rateLimit.allowed) {
    const error = new Error(submissionMessages.rateLimitExceeded);
    error.statusCode = 429;
    error.data = {
      retryAfter: rateLimit.resetIn,
      current: rateLimit.current,
      limit: rateLimit.limit,
    };
    throw error;
  }

  // Check if problem exists
  const problem = await prismaClient.problem.findUnique({
    where: { id: problemId },
    select: { id: true, isPublic: true, title: true, sourceLimit: true },
  });

  if (!problem) {
    const error = new Error(submissionMessages.problemNotFound);
    error.statusCode = 404;
    throw error;
  }

  // Check code size limit
  if (code.length > problem.sourceLimit) {
    const error = new Error(`Source code exceeds limit of ${problem.sourceLimit} bytes`);
    error.statusCode = 400;
    throw error;
  }

  // If contest submission, verify registration and contest status
  if (contestId) {
    await validateContestSubmission(contestId, userId, problemId);
  } else {
    // For non-contest submissions, check if problem is public
    if (!problem.isPublic) {
      const error = new Error(submissionMessages.problemNotPublic);
      error.statusCode = 403;
      throw error;
    }
  }

  // Create submission
  const submission = await portalSubmissionRepository.createSubmission({
    userId,
    problemId,
    contestId: contestId || null,
    language,
    code,
  });

  // Queue submission for judging (via message queue)
  try {
    // Try Kafka first, fallback to RabbitMQ
    const kafkaService = (await import('../messaging/kafkaService.js')).default;
    await kafkaService.connect();
    await kafkaService.sendSubmissionCreatedEvent({
      submissionId: submission.id,
      userId,
      problemId,
      contestId: contestId || null,
      language,
      codeSize: code.length,
    });
  } catch (kafkaError) {
    console.warn('Kafka unavailable, trying RabbitMQ:', kafkaError.message);
    try {
      const rabbitmqService = (await import('../messaging/rabbitmqService.js')).default;
      await rabbitmqService.connect();
      await rabbitmqService.sendJudgeJob({
        submissionId: submission.id,
        userId,
        problemId,
        contestId: contestId || null,
        language,
        code,
      });
    } catch (rabbitmqError) {
      console.error('Failed to queue submission for judging:', rabbitmqError);
      // Don't throw - submission is created, judging will retry
    }
  }

  return {
    id: submission.id,
    problemId: submission.problemId,
    language: submission.language,
    status: submission.status,
    createdAt: submission.createdAt,
  };
}

/**
 * Validate contest submission
 * @private
 */
async function validateContestSubmission(contestId, userId, problemId) {
  const contest = await prismaClient.contest.findUnique({
    where: { id: contestId },
    select: { id: true, status: true, startTime: true, endTime: true },
  });

  if (!contest) {
    const error = new Error(contestMessages.contestNotFound);
    error.statusCode = 404;
    throw error;
  }

  if (contest.status !== 'RUNNING') {
    const error = new Error(contestMessages.contestNotRunning);
    error.statusCode = 400;
    throw error;
  }

  const now = new Date();
  if (now < contest.startTime || now > contest.endTime) {
    const error = new Error(contestMessages.contestNotActive);
    error.statusCode = 400;
    throw error;
  }

  // Check if user is registered
  const isRegistered = await portalContestRepository.isUserRegistered(contestId, userId);
  if (!isRegistered) {
    const error = new Error(contestMessages.mustRegisterFirst);
    error.statusCode = 403;
    throw error;
  }

  // Check if problem is part of contest
  const contestProblem = await prismaClient.contestProblem.findUnique({
    where: {
      contestId_problemId: {
        contestId,
        problemId,
      },
    },
  });

  if (!contestProblem) {
    const error = new Error(contestMessages.problemNotInContest);
    error.statusCode = 400;
    throw error;
  }
}

/**
 * Get submission by ID
 * @param {string} submissionId - Submission ID
 * @param {string|null} userId - User ID for ownership check
 * @returns {Promise<Object>} Submission details
 * @throws {Error} If submission not found
 */
async function getSubmissionById(submissionId, userId = null) {
  const submission = await portalSubmissionRepository.findById(submissionId, userId);

  if (!submission) {
    const error = new Error(submissionMessages.submissionNotFound);
    error.statusCode = 404;
    throw error;
  }

  // Include source code only for owner
  const isOwner = userId && submission.userId === userId;

  return {
    ...submission,
    code: isOwner ? submission.code : undefined,
    isOwner,
  };
}

/**
 * Get user's submissions
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Paginated submissions
 */
async function getUserSubmissions(userId, options) {
  return await portalSubmissionRepository.findUserSubmissions(userId, options);
}

/**
 * Get submissions for a problem
 * @param {string} problemId - Problem ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} Paginated submissions
 * @throws {Error} If problem not found
 */
async function getProblemSubmissions(problemId, options) {
  // Check if problem exists and is public
  const problem = await prismaClient.problem.findUnique({
    where: { id: problemId },
    select: { id: true, isPublic: true },
  });

  if (!problem || !problem.isPublic) {
    const error = new Error(submissionMessages.problemNotFound);
    error.statusCode = 404;
    throw error;
  }

  return await portalSubmissionRepository.getProblemSubmissions(problemId, options);
}

/**
 * Get user's submission statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User stats
 */
async function getUserSubmissionStats(userId) {
  return await portalSubmissionRepository.getUserSubmissionStats(userId);
}

/**
 * Get user's best submission for a problem
 * @param {string} userId - User ID
 * @param {string} problemId - Problem ID
 * @returns {Promise<Object>} Best submission
 * @throws {Error} If no submissions found
 */
async function getBestSubmission(userId, problemId) {
  const best = await portalSubmissionRepository.getBestSubmission(userId, problemId);

  if (!best) {
    const error = new Error(submissionMessages.noSubmissionsFound);
    error.statusCode = 404;
    throw error;
  }

  return best;
}

/**
 * Run code without judging
 * @param {string} userId - User ID
 * @param {Object} codeData - Code execution data
 * @returns {Promise<Object>} Run status
 * @throws {Error} If rate limit exceeded
 */
async function runCode(userId, codeData) {
  const { language, code, stdin } = codeData;

  // Check rate limit (more lenient for run)
  const rateLimit = await portalSubmissionRepository.checkRateLimit(userId, 1, 20);
  if (!rateLimit.allowed) {
    const error = new Error(submissionMessages.rateLimitExceeded);
    error.statusCode = 429;
    error.data = {
      retryAfter: rateLimit.resetIn,
    };
    throw error;
  }

  // Send to code execution service (Judge0)
  try {
    const judge0Service = (await import('../../services/external/judge0Service.js')).default;
    
    const languageId = judge0Service.getLanguageId(language);
    const executionResult = await judge0Service.submitCode({
      source_code: code,
      language_id: languageId,
      stdin: stdin || '',
      cpu_time_limit: 5,
      memory_limit: 256000,
    });

    return {
      runId: executionResult.token || `run_${Date.now()}`,
      status: 'RUNNING',
      language,
      stdout: executionResult.stdout || null,
      stderr: executionResult.stderr || null,
      compilationError: executionResult.compile_output || null,
    };
  } catch (error) {
    console.error('Code execution failed:', error);
    const executionError = new Error('Failed to execute code: ' + error.message);
    executionError.statusCode = 500;
    throw executionError;
  }
}

export default {
  createSubmission,
  getSubmissionById,
  getUserSubmissions,
  getProblemSubmissions,
  getUserSubmissionStats,
  getBestSubmission,
  runCode,
};

export {
  createSubmission,
  getSubmissionById,
  getUserSubmissions,
  getProblemSubmissions,
  getUserSubmissionStats,
  getBestSubmission,
  runCode,
};
