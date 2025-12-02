/**
 * @fileoverview Submission Use Cases - Business Logic
 * Core domain logic for submission operations
 */

const { v4: uuidv4 } = require('uuid');
const submissionRepository = require('./submissionRepository');
const { submissionMessages } = require('../../../constant/submission');
const { EXECUTION_LIMITS } = require('../../../constant/judge');

/**
 * Create submission use case
 * Contains all business rules for submission creation
 */
class CreateSubmissionUseCase {
  constructor({ cacheService, queueService, eventPublisher }) {
    this.cacheService = cacheService;
    this.queueService = queueService;
    this.eventPublisher = eventPublisher;
  }

  /**
   * Execute the use case
   * @param {string} userId - User ID
   * @param {Object} data - Submission data
   * @returns {Promise<Object>} Created submission
   */
  async execute(userId, data) {
    // Business Rule: Validate source code size
    if (data.source.length > EXECUTION_LIMITS.MAX_SOURCE_SIZE_BYTES) {
      throw new Error(`Source code exceeds maximum size of ${EXECUTION_LIMITS.MAX_SOURCE_SIZE_BYTES} bytes`);
    }

    // Business Rule: Check rate limit
    const rateLimit = await this.cacheService.checkRateLimit(userId);
    if (!rateLimit.allowed) {
      const error = new Error('Rate limit exceeded. Please wait before submitting again.');
      error.statusCode = 429;
      error.remaining = rateLimit.remaining;
      throw error;
    }

    // Business Rule: Validate code is not empty
    if (!data.source || data.source.trim().length === 0) {
      throw new Error(submissionMessages.codeRequired);
    }

    const submissionId = uuidv4();
    const createdAt = new Date().toISOString();

    // Persist submission with code for recovery
    const submission = await submissionRepository.create({
      id: submissionId,
      userId,
      problemId: data.problemId,
      language: data.language,
      code: data.source, // Store actual code for crash recovery
      status: 'QUEUED',
      isRunOnly: data.isRunOnly || false,
      createdAt,
    });

    // Publish domain event (for analytics, monitoring)
    await this.eventPublisher.publishSubmissionCreated({
      submissionId,
      userId,
      problemId: data.problemId,
      timestamp: createdAt,
    });

    // Queue for execution (infrastructure concern)
    await this.queueService.enqueueJudgeJob({
      submissionId,
      userId,
      problemId: data.problemId,
      language: data.language,
      source: data.source,
      stdin: data.stdin || '',
      cpuLimitSec: EXECUTION_LIMITS.CPU_TIME_LIMIT_SEC,
      memoryLimitKb: EXECUTION_LIMITS.MEMORY_LIMIT_KB,
      createdAt,
      isRunOnly: data.isRunOnly || false,
    });

    // Update cache
    await this.cacheService.updateSubmissionStatus(submissionId, 'QUEUED');

    return {
      submissionId,
      status: 'QUEUED',
      createdAt,
    };
  }
}

/**
 * Get submission use case
 */
class GetSubmissionUseCase {
  constructor({ cacheService } = {}) {
    this.cacheService = cacheService;
  }

  /**
   * Execute the use case
   * @param {string} submissionId - Submission ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>} Submission
   */
  async execute(submissionId, userId) {
    // Try cache first (if available)
    let submission = null;
    if (this.cacheService) {
      submission = await this.cacheService.getCachedSubmissionResult(submissionId);
    }

    // Fetch from database if not cached
    if (!submission) {
      submission = await submissionRepository.findById(submissionId);

      if (!submission) {
        const error = new Error(submissionMessages.notFound);
        error.statusCode = 404;
        throw error;
      }

      // Cache if finished and cacheService available
      if (this.cacheService && submission.status !== 'QUEUED' && submission.status !== 'RUNNING') {
        await this.cacheService.cacheSubmissionResult(submissionId, submission, 3600);
      }
    }

    // Business Rule: Users can only see their own submissions
    if (submission.userId !== userId) {
      const error = new Error(submissionMessages.unauthorized);
      error.statusCode = 403;
      throw error;
    }

    return submission;
  }
}

/**
 * Get user submissions use case
 */
class GetUserSubmissionsUseCase {
  /**
   * Execute the use case
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Paginated submissions
   */
  async execute(userId, filters) {
    return await submissionRepository.findByUser(userId, filters);
  }
}

/**
 * Update submission result use case (called by worker)
 */
class UpdateSubmissionResultUseCase {
  constructor({ eventPublisher }) {
    this.eventPublisher = eventPublisher;
  }

  /**
   * Execute the use case
   * @param {string} submissionId - Submission ID
   * @param {Object} result - Execution result
   * @returns {Promise<Object>} Updated submission
   */
  async execute(submissionId, result) {
    const submission = await submissionRepository.updateResult(submissionId, {
      ...result,
      finishedAt: new Date().toISOString(),
    });

    // Publish domain event
    await this.eventPublisher.publishSubmissionFinished({
      submissionId: submission.id,
      userId: submission.userId,
      problemId: submission.problemId,
      status: submission.status,
      score: submission.score,
      time: submission.time,
      memory: submission.memory,
      timestamp: new Date().toISOString(),
    });

    return submission;
  }
}

module.exports = {
  CreateSubmissionUseCase,
  GetSubmissionUseCase,
  GetUserSubmissionsUseCase,
  UpdateSubmissionResultUseCase,
};
