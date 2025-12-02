/**
 * @fileoverview Judge0 external API service for code execution
 */

const axios = require('axios');
const { JUDGE0_LANGUAGES, JUDGE0_STATUS } = require('../../../constant/judge');
const { submissionMessages } = require('../../../constant/submission');

/** @typedef {import('../../../types/submissions').Judge0SubmissionRequest} Judge0SubmissionRequest */
/** @typedef {import('../../../types/submissions').Judge0SubmissionResponse} Judge0SubmissionResponse */
/** @typedef {import('../../../types/submissions').Judge0Result} Judge0Result */

class Judge0Service {
  constructor() {
    this.baseUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
    this.apiKey = process.env.JUDGE0_API_KEY || '';
    this.apiHost = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
  }

  /**
   * Get language ID for a given language string
   * @param {string} language - Language identifier
   * @returns {number} Judge0 language ID
   * @throws {Error} If language not supported
   */
  getLanguageId(language) {
    const langId = JUDGE0_LANGUAGES[language.toLowerCase()];
    if (!langId) {
      throw new Error(`Unsupported language: ${language}`);
    }
    return langId;
  }

  /**
   * Submit code for execution (async mode)
   * @param {Judge0SubmissionRequest} submission - Submission request
   * @returns {Promise<Judge0SubmissionResponse>} Submission response with token
   */
  async submitCode(submission) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/submissions`,
        submission,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': this.apiHost,
          },
          params: {
            base64_encoded: 'false',
            wait: 'false',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Judge0 submission failed:', error.response?.data || error.message);
      throw new Error(submissionMessages.judge0SubmitFailed);
    }
  }

  /**
   * Get submission result by token (polling)
   * @param {string} token - Submission token
   * @returns {Promise<Judge0Result>} Execution result
   */
  async getSubmissionResult(token) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/submissions/${token}`,
        {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': this.apiHost,
          },
          params: {
            base64_encoded: 'false',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Judge0 result fetch failed:', error.response?.data || error.message);
      throw new Error(submissionMessages.judge0FetchFailed);
    }
  }

  /**
   * Poll for submission result until completion
   * @param {string} token - Submission token
   * @param {number} maxAttempts - Maximum polling attempts (default: 30)
   * @param {number} intervalMs - Polling interval in ms (default: 1000)
   * @returns {Promise<Judge0Result>} Final execution result
   */
  async pollSubmissionResult(token, maxAttempts = 30, intervalMs = 1000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await this.getSubmissionResult(token);

      // Status 1 = In Queue, 2 = Processing
      if (result.status.id > 2) {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(submissionMessages.judge0Timeout);
  }

  /**
   * Map Judge0 status to internal status
   * @param {number} judge0StatusId - Judge0 status ID
   * @returns {string} Internal status string
   */
  mapStatus(judge0StatusId) {
    return JUDGE0_STATUS[judge0StatusId] || 'FAILED';
  }
}

// Singleton instance
const judge0Service = new Judge0Service();

module.exports = judge0Service;
