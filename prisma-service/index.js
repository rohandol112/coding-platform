/**
 * @fileoverview Prisma service - Database operations for submissions
 * This service owns the database and exposes REST endpoints for DB operations
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const kafkaService = require('../services/messaging/kafkaService');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT = process.env.PRISMA_SERVICE_PORT || 3001;

/** @typedef {import('../types/submissions').PrismaCreateSubmissionPayload} PrismaCreateSubmissionPayload */
/** @typedef {import('../types/submissions').PrismaUpdateResultPayload} PrismaUpdateResultPayload */

/**
 * POST /prisma/submissions
 * Create a new submission record
 */
app.post('/prisma/submissions', async (req, res) => {
  try {
    const { id, userId, problemId, language, sourceRef, status, isRunOnly, createdAt } = req.body;

    const submission = await prisma.submission.create({
      data: {
        id,
        userId,
        problemId,
        language,
        sourceRef,
        status,
        isRunOnly,
        createdAt: new Date(createdAt),
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error('Failed to create submission:', error);

    if (error.code === 'P2003') {
      // Foreign key constraint failed
      return res.status(404).json({
        success: false,
        message: 'User or Problem not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create submission',
      error: error.message,
    });
  }
});

/**
 * GET /prisma/submissions/:id
 * Get submission by ID
 */
app.get('/prisma/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error('Failed to get submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get submission',
      error: error.message,
    });
  }
});

/**
 * PATCH /prisma/submissions/:id/status
 * Update submission status only
 */
app.patch('/prisma/submissions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const submission = await prisma.submission.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(submission);
  } catch (error) {
    console.error('Failed to update submission status:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update submission status',
      error: error.message,
    });
  }
});

/**
 * PUT /prisma/submissions/:id/result
 * Update submission with final result
 */
app.put('/prisma/submissions/:id/result', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, score, time, memory, stdout, stderr, testcaseResults, finishedAt } = req.body;

    const submission = await prisma.submission.update({
      where: { id },
      data: {
        status,
        score,
        time,
        memory,
        stdout,
        stderr,
        testcaseResults,
        finishedAt: new Date(finishedAt),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        problem: {
          select: {
            id: true,
          },
        },
      },
    });

    // Publish submission_finished event to Kafka
    try {
      await kafkaService.publishSubmissionFinished({
        submissionId: submission.id,
        userId: submission.userId,
        problemId: submission.problemId,
        status: submission.status,
        score: submission.score,
        time: submission.time,
        memory: submission.memory,
        timestamp: new Date().toISOString(),
      });
    } catch (kafkaError) {
      console.error('Failed to publish submission_finished event:', kafkaError);
      // Don't fail the request if Kafka publish fails
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error('Failed to update submission result:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update submission result',
      error: error.message,
    });
  }
});

/**
 * GET /prisma/submissions/user/:userId
 * Get user's submissions with pagination
 */
app.get('/prisma/submissions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, problemId, status } = req.query;

    const where = { userId };
    if (problemId) where.problemId = problemId;
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            },
          },
        },
      }),
      prisma.submission.count({ where }),
    ]);

    res.status(200).json({
      submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Failed to get user submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user submissions',
      error: error.message,
    });
  }
});

/**
 * GET /prisma/problems
 * Get problems with pagination and filters
 */
app.get('/prisma/problems', async (req, res) => {
  try {
    const { page = 1, limit = 20, difficulty, tags } = req.query;

    const where = {};
    if (difficulty) where.difficulty = difficulty;
    if (tags) {
      const tagArray = tags.split(',');
      where.tags = { hasSome: tagArray };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.problem.count({ where }),
    ]);

    res.status(200).json({
      problems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Failed to get problems:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get problems',
      error: error.message,
    });
  }
});

/**
 * GET /prisma/problems/:id
 * Get problem by ID
 */
app.get('/prisma/problems/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error('Failed to get problem:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get problem',
      error: error.message,
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'prisma' });
});

// Start server
async function startServer() {
  try {
    // Connect Kafka producer
    await kafkaService.connect();

    app.listen(PORT, () => {
      console.log(`✓ Prisma service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Prisma service:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down Prisma service...');
  await prisma.$disconnect();
  await kafkaService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down Prisma service...');
  await prisma.$disconnect();
  await kafkaService.disconnect();
  process.exit(0);
});

// Only start if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;
