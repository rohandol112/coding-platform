/**
 * @fileoverview Submission business logic service
 */

const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const kafkaService = require('../../messaging/kafkaService');
const rabbitmqService = require('../../messaging/rabbitmqService');
const redisService = require('../../cache/redisService');
const { EXECUTION_LIMITS } = require('../../../constant/judge');
const { httpMessages, authMessages } = require('../../../constant/messages');

/** @typedef {import('../../../types/submissions').CreateSubmissionRequest} CreateSubmissionRequest */
/** @typedef {import('../../../types/submissions').CreateSubmissionResponse} CreateSubmissionResponse */
/** @typedef {import('../../../types/submissions').SubmissionResult} SubmissionResult */

const prismaServiceUrl = process.env.PRISMA_SERVICE_URL || 'http://localhost:3001';

/**
 * Create a new code submission
 * @param {string} userId - User ID from JWT
 * @param {CreateSubmissionRequest} submissionData - Submission data
 * @returns {Promise<CreateSubmissionResponse>} Created submission
 * @throws {Error} If submission creation fails
 */
async function createSubmission(userId, submissionData) {
  const { problemId, language, source, stdin, isRunOnly } = submissionData;

  // Validate source code size
  if (source.length > EXECUTION_LIMITS.MAX_SOURCE_SIZE_BYTES) {
    throw new Error(`Source code exceeds maximum size of ${EXECUTION_LIMITS.MAX_SOURCE_SIZE_BYTES} bytes`);
  }

  // Check rate limit
  const rateLimit = await redisService.checkRateLimit(userId);
  if (!rateLimit.allowed) {
    const error = new Error('Rate limit exceeded. Please wait before submitting again.');
    error.statusCode = 429;
    error.remaining = rateLimit.remaining;
    throw error;
  }

  // Generate submission ID
  const submissionId = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    // 1. Persist submission via Prisma service
    await axios.post(
      `${prismaServiceUrl}/prisma/submissions`,
      {
        id: submissionId,
        userId,
        problemId,
        language,
        sourceRef: null,
        status: 'QUEUED',
        isRunOnly: isRunOnly || false,
        createdAt,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // 2. Publish submission_created event to Kafka
    await kafkaService.publishSubmissionCreated({
      submissionId,
      userId,
      problemId,
      timestamp: createdAt,
    });

    // 3. Enqueue job to RabbitMQ
    await rabbitmqService.enqueueJudgeJob({
      submissionId,
      userId,
      problemId,
      language,
      source,
      stdin: stdin || '',
      cpuLimitSec: EXECUTION_LIMITS.CPU_TIME_LIMIT_SEC,
      memoryLimitKb: EXECUTION_LIMITS.MEMORY_LIMIT_KB,
      createdAt,
      isRunOnly: isRunOnly || false,
    });

    // 4. Update status in Redis
    await redisService.updateSubmissionStatus(submissionId, 'QUEUED');

    return {
      submissionId,
      status: 'QUEUED',
      createdAt,
    };
  } catch (error) {
    console.error('Failed to create submission:', error);

    // Check if it's a problem not found error
    if (error.response?.status === 404) {
      const notFoundError = new Error('Problem not found');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw new Error('Failed to create submission');
  }
}

/**
 * Get submission by ID
 * @param {string} submissionId - Submission ID
 * @returns {Promise<SubmissionResult>} Submission result
 * @throws {Error} If submission not found
 */
async function getSubmissionById(submissionId) {
  try {
    // Try to get from Redis cache first
    let submission = await redisService.getCachedSubmissionResult(submissionId);

    if (!submission) {
      // Fetch from database via Prisma service
      const response = await axios.get(
        `${prismaServiceUrl}/prisma/submissions/${submissionId}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      submission = response.data;

      // Cache if finished
      if (submission.status !== 'QUEUED' && submission.status !== 'RUNNING') {
        await redisService.cacheSubmissionResult(submissionId, submission, 3600);
      }
    }

    return submission;
  } catch (error) {
    console.error('Failed to get submission:', error);

    if (error.response?.status === 404) {
      const notFoundError = new Error('Submission not found');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw new Error('Failed to get submission');
  }
}

/**
 * Get user's submissions with pagination
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} [options.problemId] - Filter by problem ID
 * @param {string} [options.status] - Filter by status
 * @returns {Promise<Object>} Paginated submissions
 */
async function getUserSubmissions(userId, options) {
  const { page = 1, limit = 20, problemId, status } = options;

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (problemId) params.append('problemId', problemId);
    if (status) params.append('status', status);

    const response = await axios.get(
      `${prismaServiceUrl}/prisma/submissions/user/${userId}?${params.toString()}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get user submissions:', error);
    throw new Error('Failed to get user submissions');
  }
}

module.exports = {
  createSubmission,
  getSubmissionById,
  getUserSubmissions,
};
