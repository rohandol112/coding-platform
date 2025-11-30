const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all problems
app.get('/api/problems', async (req, res) => {
  try {
    const problems = await prisma.problem.findMany();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get problem by ID
app.get('/api/problems/:id', async (req, res) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id }
    });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create problem
app.post('/api/problems', async (req, res) => {
  try {
    const problem = await prisma.problem.create({
      data: req.body
    });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        user: true,
        problem: true
      }
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create submission
app.post('/api/submissions', async (req, res) => {
  try {
    const submission = await prisma.submission.create({
      data: req.body
    });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all contests
app.get('/api/contests', async (req, res) => {
  try {
    const contests = await prisma.contest.findMany({
      include: {
        problems: {
          include: {
            problem: true
          }
        }
      }
    });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contest
app.post('/api/contests', async (req, res) => {
  try {
    const contest = await prisma.contest.create({
      data: req.body
    });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Prisma service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});