/**
 * @fileoverview Judge0 language mappings and submission status constants
 */

/**
 * Judge0 language ID mappings
 * @see https://github.com/judge0/judge0/blob/master/CHANGELOG.md
 */
const JUDGE0_LANGUAGES = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java (OpenJDK 13)
  cpp: 54,         // C++ (GCC 9.2.0)
  c: 50,           // C (GCC 9.2.0)
  csharp: 51,      // C# (Mono 6.6.0.161)
  go: 60,          // Go (1.13.5)
  rust: 73,        // Rust (1.40.0)
  typescript: 74,  // TypeScript (3.7.4)
  kotlin: 78,      // Kotlin (1.3.70)
  swift: 83,       // Swift (5.2.3)
  ruby: 72,        // Ruby (2.7.0)
  php: 68,         // PHP (7.4.1)
};

/**
 * Judge0 status ID to readable status mapping
 */
const JUDGE0_STATUS = {
  1: 'QUEUED',
  2: 'RUNNING',
  3: 'ACCEPTED',
  4: 'WRONG_ANSWER',
  5: 'TIME_LIMIT_EXCEEDED',
  6: 'COMPILE_ERROR',
  7: 'RUNTIME_ERROR',
  8: 'RUNTIME_ERROR',
  9: 'RUNTIME_ERROR',
  10: 'RUNTIME_ERROR',
  11: 'RUNTIME_ERROR',
  12: 'RUNTIME_ERROR',
  13: 'FAILED',
  14: 'FAILED',
};

/**
 * Default execution limits
 */
const EXECUTION_LIMITS = {
  CPU_TIME_LIMIT_SEC: 2,
  MEMORY_LIMIT_KB: 262144, // 256 MB
  MAX_SOURCE_SIZE_BYTES: 65536, // 64 KB
};

/**
 * RabbitMQ queue names
 */
const RABBITMQ_QUEUES = {
  JUDGE_JOBS: 'judge_jobs',
  JUDGE_JOBS_DLQ: 'judge_jobs_dlq',
};

/**
 * Kafka topic names
 */
const KAFKA_TOPICS = {
  SUBMISSION_CREATED: 'submission_created',
  SUBMISSION_FINISHED: 'submission_finished',
};

/**
 * Redis key prefixes
 */
const REDIS_KEYS = {
  SUBMISSION_RESULT: 'submission:result:',
  SUBMISSION_STATUS: 'submission:status:',
  USER_RATE_LIMIT: 'ratelimit:user:',
};

/**
 * Rate limiting configuration
 */
const RATE_LIMITS = {
  SUBMISSIONS_PER_MINUTE: 10,
  SUBMISSIONS_PER_HOUR: 100,
};

module.exports = {
  JUDGE0_LANGUAGES,
  JUDGE0_STATUS,
  EXECUTION_LIMITS,
  RABBITMQ_QUEUES,
  KAFKA_TOPICS,
  REDIS_KEYS,
  RATE_LIMITS,
};
