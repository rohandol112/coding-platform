/**
 * @fileoverview WebSocket service for real-time submission updates
 */

const { Server } = require('socket.io');
const { validateToken } = require('../../library/jwtUtil');
const { Kafka } = require('kafkajs');
const { KAFKA_TOPICS } = require('../../constant/judge');

class WebSocketService {
  constructor() {
    this.io = null;
    this.kafka = null;
    this.consumer = null;
    this.userSockets = new Map();
  }

  /**
   * Initialize WebSocket server
   * @param {import('http').Server} httpServer - HTTP server instance
   * @returns {Promise<void>}
   */
  async initialize(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:4200',
        credentials: true,
      },
      path: '/ws',
    });

    // Setup authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.query.token;

        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = validateToken(token);
        socket.userId = decoded.userId;
        socket.email = decoded.email;

        next();
      } catch (error) {
        console.error('WebSocket authentication failed:', error);
        next(new Error('Invalid authentication token'));
      }
    });

    // Handle connections
    this.io.on('connection', (socket) => {
      console.log(`✓ WebSocket client connected: ${socket.userId}`);

      if (!this.userSockets.has(socket.userId)) {
        this.userSockets.set(socket.userId, new Set());
      }
      this.userSockets.get(socket.userId).add(socket.id);

      socket.join(`user:${socket.userId}`);

      socket.on('disconnect', () => {
        console.log(`✗ WebSocket client disconnected: ${socket.userId}`);
        const userSocketSet = this.userSockets.get(socket.userId);
        if (userSocketSet) {
          userSocketSet.delete(socket.id);
          if (userSocketSet.size === 0) {
            this.userSockets.delete(socket.userId);
          }
        }
      });

      socket.emit('connected', {
        message: 'Connected to submission updates',
        userId: socket.userId,
      });
    });

    // Start Kafka consumer for submission events
    await this.startKafkaConsumer();

    console.log('✓ WebSocket server initialized');
  }

  /**
   * Start Kafka consumer to listen for submission events
   * @private
   * @returns {Promise<void>}
   */
  async startKafkaConsumer() {
    this.kafka = new Kafka({
      clientId: 'coding-platform-websocket',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });

    this.consumer = this.kafka.consumer({ groupId: 'websocket-consumers' });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: [KAFKA_TOPICS.SUBMISSION_CREATED, KAFKA_TOPICS.SUBMISSION_FINISHED],
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());

          if (topic === KAFKA_TOPICS.SUBMISSION_CREATED) {
            this.notifySubmissionCreated(event);
          } else if (topic === KAFKA_TOPICS.SUBMISSION_FINISHED) {
            this.notifySubmissionFinished(event);
          }
        } catch (error) {
          console.error('Failed to process Kafka message:', error);
        }
      },
    });

    console.log('✓ Kafka consumer for WebSocket started');
  }

  /**
   * Notify user about submission created
   * @private
   * @param {Object} event - Submission created event
   */
  notifySubmissionCreated(event) {
    this.io.to(`user:${event.userId}`).emit('submission:created', {
      submissionId: event.submissionId,
      problemId: event.problemId,
      status: 'QUEUED',
      timestamp: event.timestamp,
    });
  }

  /**
   * Notify user about submission finished
   * @private
   * @param {Object} event - Submission finished event
   */
  notifySubmissionFinished(event) {
    this.io.to(`user:${event.userId}`).emit('submission:finished', {
      submissionId: event.submissionId,
      problemId: event.problemId,
      status: event.status,
      score: event.score,
      time: event.time,
      memory: event.memory,
      timestamp: event.timestamp,
    });
  }

  /**
   * Send submission status update to specific user
   * @param {string} userId - User ID
   * @param {Object} update - Status update
   */
  sendStatusUpdate(userId, update) {
    this.io.to(`user:${userId}`).emit('submission:status', update);
  }

  /**
   * Disconnect WebSocket server
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
    if (this.io) {
      this.io.close();
    }
    console.log('✓ WebSocket server disconnected');
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

module.exports = webSocketService;
