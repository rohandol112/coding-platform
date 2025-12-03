/**
 * @fileoverview Kafka messaging service for submission events
 */

import { Kafka } from 'kafkajs';
import { KAFKA_TOPICS } from '../../constant/judge.js';

/** @typedef {import('../../../types/submissions').KafkaSubmissionCreatedEvent} KafkaSubmissionCreatedEvent */
/** @typedef {import('../../../types/submissions').KafkaSubmissionFinishedEvent} KafkaSubmissionFinishedEvent */

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'coding-platform-api',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    this.isConnected = false;
  }

  /**
   * Connect to Kafka broker
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.isConnected) return;

    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log('✓ Kafka producer connected');
    } catch (error) {
      console.error('Failed to connect Kafka producer:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Kafka broker
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.isConnected) return;

    try {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('✓ Kafka producer disconnected');
    } catch (error) {
      console.error('Failed to disconnect Kafka producer:', error);
    }
  }

  /**
   * Publish submission created event
   * @param {KafkaSubmissionCreatedEvent} event - Submission created event
   * @returns {Promise<void>}
   */
  async publishSubmissionCreated(event) {
    await this.ensureConnected();

    try {
      await this.producer.send({
        topic: KAFKA_TOPICS.SUBMISSION_CREATED,
        messages: [
          {
            key: event.submissionId,
            value: JSON.stringify(event),
            timestamp: new Date(event.timestamp).getTime().toString(),
          },
        ],
      });

      console.log(`✓ Published submission_created: ${event.submissionId}`);
    } catch (error) {
      console.error('Failed to publish submission_created event:', error);
      throw error;
    }
  }

  /**
   * Publish submission finished event
   * @param {KafkaSubmissionFinishedEvent} event - Submission finished event
   * @returns {Promise<void>}
   */
  async publishSubmissionFinished(event) {
    await this.ensureConnected();

    try {
      await this.producer.send({
        topic: KAFKA_TOPICS.SUBMISSION_FINISHED,
        messages: [
          {
            key: event.submissionId,
            value: JSON.stringify(event),
            timestamp: new Date(event.timestamp).getTime().toString(),
          },
        ],
      });

      console.log(`✓ Published submission_finished: ${event.submissionId}`);
    } catch (error) {
      console.error('Failed to publish submission_finished event:', error);
      throw error;
    }
  }

  /**
   * Ensure producer is connected
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
const kafkaService = new KafkaService();

export default kafkaService;
