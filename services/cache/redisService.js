/**
 * @fileoverview Redis caching service for submissions
 */

const Redis = require('ioredis');
const { REDIS_KEYS, RATE_LIMITS } = require('../../../constant/judge');

class RedisService {
  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('connect', () => {
      console.log('✓ Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  /**
   * Cache submission result
   * @param {string} submissionId - Submission ID
   * @param {Object} result - Submission result
   * @param {number} ttl - TTL in seconds (default: 3600)
   * @returns {Promise<void>}
   */
  async cacheSubmissionResult(submissionId, result, ttl = 3600) {
    try {
      const key = REDIS_KEYS.SUBMISSION_RESULT + submissionId;
      await this.client.setex(key, ttl, JSON.stringify(result));
    } catch (error) {
      console.error('Failed to cache submission result:', error);
    }
  }

  /**
   * Get cached submission result
   * @param {string} submissionId - Submission ID
   * @returns {Promise<Object|null>} Cached result or null
   */
  async getCachedSubmissionResult(submissionId) {
    try {
      const key = REDIS_KEYS.SUBMISSION_RESULT + submissionId;
      const cached = await this.client.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to get cached submission result:', error);
      return null;
    }
  }

  /**
   * Update submission status in cache
   * @param {string} submissionId - Submission ID
   * @param {string} status - New status
   * @param {number} ttl - TTL in seconds (default: 300)
   * @returns {Promise<void>}
   */
  async updateSubmissionStatus(submissionId, status, ttl = 300) {
    try {
      const key = REDIS_KEYS.SUBMISSION_STATUS + submissionId;
      await this.client.setex(key, ttl, status);
    } catch (error) {
      console.error('Failed to update submission status:', error);
    }
  }

  /**
   * Get submission status from cache
   * @param {string} submissionId - Submission ID
   * @returns {Promise<string|null>} Status or null
   */
  async getSubmissionStatus(submissionId) {
    try {
      const key = REDIS_KEYS.SUBMISSION_STATUS + submissionId;
      return await this.client.get(key);
    } catch (error) {
      console.error('Failed to get submission status:', error);
      return null;
    }
  }

  /**
   * Check rate limit for user submissions
   * @param {string} userId - User ID
   * @returns {Promise<{allowed: boolean, remaining: number}>} Rate limit status
   */
  async checkRateLimit(userId) {
    try {
      const key = REDIS_KEYS.USER_RATE_LIMIT + userId;
      const current = await this.client.incr(key);

      if (current === 1) {
        await this.client.expire(key, 60);
      }

      const remaining = Math.max(0, RATE_LIMITS.SUBMISSIONS_PER_MINUTE - current);
      const allowed = current <= RATE_LIMITS.SUBMISSIONS_PER_MINUTE;

      return { allowed, remaining };
    } catch (error) {
      console.error('Failed to check rate limit:', error);
      return { allowed: true, remaining: RATE_LIMITS.SUBMISSIONS_PER_MINUTE };
    }
  }

  /**
   * Disconnect Redis client
   * @returns {Promise<void>}
   */
  async disconnect() {
    await this.client.quit();
    console.log('✓ Redis disconnected');
  }
}

// Singleton instance
const redisService = new RedisService();

module.exports = redisService;
