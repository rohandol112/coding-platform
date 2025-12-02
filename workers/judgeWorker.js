/**
 * @fileoverview Judge Worker - Infrastructure only
 * No business logic - only queue mechanics and orchestration
 */

require('dotenv').config();
const amqp = require('amqplib');
const { RABBITMQ_QUEUES } = require('../constant/judge');
const judge0Service = require('../services/external/judge0Service');
const kafkaService = require('../services/messaging/kafkaService');
const submissionRepository = require('../library/domain/submission/submissionRepository');
const CodeExecutor = require('../library/domain/submission/codeExecutor');
const { UpdateSubmissionResultUseCase } = require('../library/domain/submission/submissionUseCase');

let connection = null;
let channel = null;

// Initialize domain services
const codeExecutor = new CodeExecutor({ judge0Client: judge0Service });
const updateResultUseCase = new UpdateSubmissionResultUseCase({ eventPublisher: kafkaService });

/**
 * Process judge job (orchestration only - delegates to domain)
 * @param {amqp.Message} msg - RabbitMQ message
 */
async function processJob(msg) {
  let job;

  try {
    job = JSON.parse(msg.content.toString());
    console.log(`\n🔨 Processing submission: ${job.submissionId}`);

    // Update status (repository call)
    await submissionRepository.updateStatus(job.submissionId, 'RUNNING');

    // Execute code (domain logic)
    const result = await codeExecutor.execute(job);

    // Persist result (use case handles business rules + events)
    await updateResultUseCase.execute(job.submissionId, result);

    console.log(`✓ Completed submission: ${job.submissionId} - ${result.status}`);

    // Acknowledge message
    channel.ack(msg);
  } catch (error) {
    console.error(`✗ Failed to process submission ${job?.submissionId}:`, error);

    // Try to persist error state
    if (job) {
      try {
        await updateResultUseCase.execute(job.submissionId, {
          status: 'FAILED',
          stderr: error.message,
          score: 0,
          time: 0,
          memory: 0,
        });
      } catch (persistError) {
        console.error('Failed to persist error state:', persistError);
      }
    }

    // Reject (will go to DLQ after max retries)
    channel.nack(msg, false, false);
  }
}

/**
 * Start worker (infrastructure setup only)
 */
async function startWorker() {
  console.log('🚀 Starting Judge Worker...\n');

  try {
    // Connect Kafka
    await kafkaService.connect();

    // Connect RabbitMQ
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    await channel.prefetch(1);
    await channel.assertQueue(RABBITMQ_QUEUES.JUDGE_JOBS, { durable: true });

    console.log('✓ Judge worker started, waiting for jobs...');

    await channel.consume(
      RABBITMQ_QUEUES.JUDGE_JOBS,
      async (msg) => {
        if (msg) await processJob(msg);
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
const shutdown = async () => {
  console.log('\n\nShutting down Judge Worker...');
  if (channel) await channel.close();
  if (connection) await connection.close();
  await kafkaService.disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startWorker();
