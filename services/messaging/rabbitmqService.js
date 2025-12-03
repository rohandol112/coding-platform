/**
 * @fileoverview RabbitMQ messaging service for judge jobs
 */

import amqp from 'amqplib';
import { RABBITMQ_QUEUES } from '../../constant/judge.js';

/** @typedef {import('../../../types/submissions').RabbitMQJudgeJob} RabbitMQJudgeJob */

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
  }

  /**
   * Connect to RabbitMQ
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.isConnected) return;

    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      // Declare main queue (durable)
      await this.channel.assertQueue(RABBITMQ_QUEUES.JUDGE_JOBS, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': RABBITMQ_QUEUES.JUDGE_JOBS_DLQ,
        },
      });

      // Declare dead-letter queue
      await this.channel.assertQueue(RABBITMQ_QUEUES.JUDGE_JOBS_DLQ, {
        durable: true,
      });

      this.isConnected = true;
      console.log('✓ RabbitMQ connected');

      // Handle connection errors
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.isConnected = false;
      });

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        this.isConnected = false;
      });
    } catch (error) {
      console.error('Failed to connect RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Disconnect from RabbitMQ
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.isConnected) return;

    try {
      await this.channel?.close();
      await this.connection?.close();
      this.isConnected = false;
      console.log('✓ RabbitMQ disconnected');
    } catch (error) {
      console.error('Failed to disconnect RabbitMQ:', error);
    }
  }

  /**
   * Enqueue a judge job
   * @param {RabbitMQJudgeJob} job - Judge job payload
   * @returns {Promise<void>}
   */
  async enqueueJudgeJob(job) {
    await this.ensureConnected();

    try {
      const message = Buffer.from(JSON.stringify(job));

      this.channel.sendToQueue(RABBITMQ_QUEUES.JUDGE_JOBS, message, {
        persistent: true,
        contentType: 'application/json',
        timestamp: Date.now(),
      });

      console.log(`✓ Enqueued judge job: ${job.submissionId}`);
    } catch (error) {
      console.error('Failed to enqueue judge job:', error);
      throw error;
    }
  }

  /**
   * Ensure connection is established
   * @private
   * @returns {Promise<void>}
   */
  async ensureConnected() {
    if (!this.isConnected) {
      await this.connect();
    }
  }
}

// Singleton instance
const rabbitmqService = new RabbitMQService();

export default rabbitmqService;
