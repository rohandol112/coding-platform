/**
 * @fileoverview Code Executor - Business logic for code execution
 * Domain service for executing code (infrastructure-agnostic)
 */

const { EXECUTION_LIMITS } = require('../../../constant/judge');

/**
 * Code Executor Domain Service
 * Contains business rules for code execution
 */
class CodeExecutor {
  constructor({ judge0Client }) {
    this.judge0Client = judge0Client;
  }

  /**
   * Execute code with test cases
   * @param {Object} job - Execution job
   * @returns {Promise<Object>} Execution result
   */
  async execute(job) {
    try {
      const languageId = this.judge0Client.getLanguageId(job.language);

      // Business Rule: Apply execution limits
      const submission = await this.judge0Client.submitCode({
        source_code: job.source,
        language_id: languageId,
        stdin: job.stdin || '',
        cpu_time_limit: (job.cpuLimitSec || EXECUTION_LIMITS.CPU_TIME_LIMIT_SEC).toString(),
        memory_limit: job.memoryLimitKb || EXECUTION_LIMITS.MEMORY_LIMIT_KB,
      });

      const judge0Result = await this.judge0Client.pollSubmissionResult(submission.token);

      // Business Rule: Map status and calculate score
      return this._mapResult(judge0Result);
    } catch (error) {
      console.error('Code execution failed:', error);
      return {
        status: 'FAILED',
        stderr: error.message,
        score: 0,
        time: 0,
        memory: 0,
      };
    }
  }

  /**
   * Map Judge0 result to domain model
   * @private
   * @param {Object} judge0Result - Judge0 result
   * @returns {Object} Domain result
   */
  _mapResult(judge0Result) {
    const status = this.judge0Client.mapStatus(judge0Result.status.id);

    return {
      status,
      time: parseFloat(judge0Result.time) || 0,
      memory: judge0Result.memory || 0,
      stdout: judge0Result.stdout || '',
      stderr: judge0Result.stderr || judge0Result.compile_output || judge0Result.message || '',
      score: judge0Result.status.id === 3 ? 100 : 0, // Business Rule: 100% for accepted
      testcaseResults: [],
    };
  }
}

module.exports = CodeExecutor;
