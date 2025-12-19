/**
 * @fileoverview Submission Service - Infrastructure wrapper
 * Thin layer that delegates to domain use cases
 */

import {
  CreateSubmissionUseCase,
  GetSubmissionUseCase,
  GetUserSubmissionsUseCase,
} from '../../../library/domain/submission/submissionUseCase.js';
import redisService from '../../cache/redisService.js';
import rabbitmqService from '../../messaging/rabbitmqService.js';
import kafkaService from '../../messaging/kafkaService.js';

/** @typedef {import('../../../types/submissions').CreateSubmissionRequest} CreateSubmissionRequest */
/** @typedef {import('../../../types/submissions').CreateSubmissionResponse} CreateSubmissionResponse */
/** @typedef {import('../../../types/submissions').SubmissionResult} SubmissionResult */

// Initialize use cases with dependencies
const createSubmissionUseCase = new CreateSubmissionUseCase({
  cacheService: redisService,
  queueService: rabbitmqService,
  eventPublisher: kafkaService,
});

const getSubmissionUseCase = new GetSubmissionUseCase({ cacheService: redisService });
const getUserSubmissionsUseCase = new GetUserSubmissionsUseCase();

/**
 * Create a new code submission (delegates to use case)
 * @param {string} userId - User ID from JWT
 * @param {CreateSubmissionRequest} submissionData - Submission data
 * @returns {Promise<CreateSubmissionResponse>} Created submission
 * @throws {Error} If submission creation fails
 */
async function createSubmission(userId, submissionData) {
  return await createSubmissionUseCase.execute(userId, submissionData);
}

/**
 * Get submission by ID (delegates to use case)
 * @param {string} submissionId - Submission ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<SubmissionResult>} Submission result
 * @throws {Error} If submission not found or unauthorized
 */
async function getSubmissionById(submissionId, userId) {
  return await getSubmissionUseCase.execute(submissionId, userId);
}

/**
 * Get user's submissions with pagination (delegates to use case)
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} [options.problemId] - Filter by problem ID
 * @param {string} [options.status] - Filter by status
 * @returns {Promise<Object>} Paginated submissions
 */
async function getUserSubmissions(userId, options) {
  return await getUserSubmissionsUseCase.execute(userId, options);
}

export default {
  createSubmission,
  getSubmissionById,
  getUserSubmissions,
};

export {
  createSubmission,
  getSubmissionById,
  getUserSubmissions,
};
