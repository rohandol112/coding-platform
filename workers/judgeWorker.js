/**
 * @fileoverview Judge worker startup script
 * Run this separately from the main API server to process judge jobs
 */

require('dotenv').config();
const amqp = require('amqplib');
const { RABBITMQ_QUEUES, EXECUTION_LIMITS } = require('../constant/judge');
const judge0Service = require('../services/external/judge0Service');
const kafkaService = require('../services/messaging/kafkaService');
const axios = require('axios');

/** @typedef {import('../types/submissions').RabbitMQJudgeJob} RabbitMQJudgeJob */

const prismaServiceUrl = process.env.PRISMA_SERVICE_URL || 'http://localhost:3001';

let connection = null;
let channel = null;
let isRunning = false;

/**
 * Process a single judge job
 * @param {amqp.Message} msg - RabbitMQ message
 * @returns {Promise<void>}
 */
async function processJob(msg) {
  let job;

  try {
    job = JSON.parse(msg.content.toString());
    console.log(`\n🔨 Processing submission: ${job.submissionId}`);

    // Update status to RUNNING
    await updateSubmissionStatus(job.submissionId, 'RUNNING');

    // Execute code via Judge0
    const result = await executeCode(job);

    // Persist result
    await persistResult(job.submissionId, result);

    // Publish finished event to Kafka
    await kafkaService.publishSubmissionFinished({
      submissionId: job.submissionId,
      userId: job.userId,
      problemId: job.problemId,
      status: result.status,
      score: result.score,
      time: result.time,
      memory: result.memory,
      timestamp: new Date().toISOString(),
    });

    console.log(`✓ Completed submission: ${job.submissionId} - ${result.status}`);

    // Acknowledge message
    channel.ack(msg);
  } catch (error) {
    console.error(`✗ Failed to process submission ${job?.submissionId}:`, error);

    // Try to persist error state
    if (job) {
      try {
        await persistResult(job.submissionId, {
          status: 'FAILED',
          stderr: error.message,
        });
      } catch (persistError) {
        console.error('Failed to persist error state:', persistError);
      }
    }

    // Reject and requeue (will go to DLQ after max retries)
    channel.nack(msg, false, false);
  }
}

/**
 * Execute code using Judge0
 * @param {RabbitMQJudgeJob} job - Judge job
 * @returns {Promise<Object>} Execution result
 */
async function executeCode(job) {
  try {
    const languageId = judge0Service.getLanguageId(job.language);

    const submission = await judge0Service.submitCode({
      source_code: job.source,
      language_id: languageId,
      stdin: job.stdin || '',
      cpu_time_limit: (job.cpuLimitSec || EXECUTION_LIMITS.CPU_TIME_LIMIT_SEC).toString(),
      memory_limit: job.memoryLimitKb || EXECUTION_LIMITS.MEMORY_LIMIT_KB,
    });

    const judge0Result = await judge0Service.pollSubmissionResult(submission.token);

    return {
      status: judge0Service.mapStatus(judge0Result.status.id),
      time: parseFloat(judge0Result.time) || 0,
      memory: judge0Result.memory || 0,
      stdout: judge0Result.stdout || '',
      stderr: judge0Result.stderr || judge0Result.compile_output || judge0Result.message || '',
      score: judge0Result.status.id === 3 ? 100 : 0,
    };
  } catch (error) {
    console.error('Code execution failed:', error);
    return {
      status: 'FAILED',
      stderr: error.message,
      score: 0,
    };
  }
}

/**
 * Update submission status in database
 * @param {string} submissionId - Submission ID
 * @param {string} status - New status
 * @returns {Promise<void>}
 */
async function updateSubmissionStatus(submissionId, status) {
  try {
    await axios.patch(
      `${prismaServiceUrl}/prisma/submissions/${submissionId}/status`,
      { status },
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to update submission status:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Persist final result to database
 * @param {string} submissionId - Submission ID
 * @param {Object} result - Execution result
 * @returns {Promise<void>}
 */
async function persistResult(submissionId, result) {
  try {
    await axios.put(
      `${prismaServiceUrl}/prisma/submissions/${submissionId}/result`,
      {
        status: result.status,
        score: result.score,
        time: result.time,
        memory: result.memory,
        stdout: result.stdout,
        stderr: result.stderr,
        testcaseResults: result.testcaseResults || [],
        finishedAt: new Date().toISOString(),
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log(`✓ Persisted result for ${submissionId}`);
  } catch (error) {
    console.error('Failed to persist result:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Start the judge worker
 * @returns {Promise<void>}
 */
async function startWorker() {
  console.log('🚀 Starting Judge Worker...\n');

  try {
    // Connect Kafka producer
    await kafkaService.connect();

    // Connect to RabbitMQ
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    // Set prefetch to 1 (process one job at a time per worker)
    await channel.prefetch(1);

    // Assert queue exists
    await channel.assertQueue(RABBITMQ_QUEUES.JUDGE_JOBS, {
      durable: true,
    });

    console.log('✓ Judge worker started, waiting for jobs...');
    isRunning = true;

    // Consume messages
    await channel.consume(
      RABBITMQ_QUEUES.JUDGE_JOBS,
      async (msg) => {
        if (msg) {
          await processJob(msg);
        }
      },
      { noAck: false }
    );

    console.log('Press Ctrl+C to stop\n');
  } catch (error) {
    console.error('Failed to start judge worker:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down Judge Worker...');
  if (channel) await channel.close();
  if (connection) await connection.close();
  await kafkaService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\nShutting down Judge Worker...');
  if (channel) await channel.close();
  if (connection) await connection.close();
  await kafkaService.disconnect();
  process.exit(0);
});

// Start the worker
startWorker();
